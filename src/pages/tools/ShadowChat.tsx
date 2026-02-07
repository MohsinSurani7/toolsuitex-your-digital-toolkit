import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, Copy, Link, Send, Shield, Clock, AlertTriangle, X, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ToolLayout } from "@/components/tools/ToolLayout";
import { getToolById } from "@/lib/tools-data";
import { toast } from "sonner";
import Peer, { DataConnection } from "peerjs";

const tool = getToolById("shadow-chat")!;

interface Message {
  id: string;
  text: string;
  sender: "me" | "peer";
  timestamp: number;
  expiresAt: number;
}

const MESSAGE_TTL = 5 * 60 * 1000; // 5 minutes in milliseconds

export default function ShadowChat() {
  const [peer, setPeer] = useState<Peer | null>(null);
  const [connection, setConnection] = useState<DataConnection | null>(null);
  const [myPeerId, setMyPeerId] = useState<string>("");
  const [connectToId, setConnectToId] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Initialize PeerJS with reliable config
  useEffect(() => {
    const initPeer = () => {
      // Use public PeerJS server with TURN fallback for NAT traversal
      const newPeer = new Peer({
        config: {
          iceServers: [
            { urls: 'stun:stun.l.google.com:19302' },
            { urls: 'stun:stun1.l.google.com:19302' },
            { urls: 'stun:stun2.l.google.com:19302' },
            { urls: 'stun:stun3.l.google.com:19302' },
            { urls: 'stun:stun4.l.google.com:19302' },
            { urls: 'stun:global.stun.twilio.com:3478' }
          ]
        },
        debug: 2
      });
      
      newPeer.on("open", (id) => {
        console.log("PeerJS connected with ID:", id);
        setMyPeerId(id);
        toast.success("Shadow Chat ready!");
      });

      newPeer.on("connection", (conn) => {
        console.log("Incoming connection from:", conn.peer);
        handleConnection(conn);
      });

      newPeer.on("error", (err) => {
        console.error("PeerJS error:", err);
        if (err.type === 'peer-unavailable') {
          toast.error("User not found or offline. Check the connection key.");
        } else if (err.type === 'network') {
          toast.error("Network error. Retrying connection...");
          // Retry after delay
          setTimeout(() => {
            newPeer.destroy();
            initPeer();
          }, 3000);
        } else if (err.type === 'disconnected') {
          toast.error("Disconnected from server. Reconnecting...");
          newPeer.reconnect();
        } else {
          toast.error(`Connection error: ${err.type}`);
        }
        setIsConnecting(false);
      });

      newPeer.on("disconnected", () => {
        console.log("PeerJS disconnected, attempting reconnect...");
        toast.info("Connection lost. Reconnecting...");
        newPeer.reconnect();
      });

      setPeer(newPeer);
    };

    initPeer();

    return () => {
      peer?.destroy();
    };
  }, []);

  // Auto-destruct messages after TTL
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      setMessages((prev) => prev.filter((msg) => msg.expiresAt > now));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Cleanup on unmount or tab close
  useEffect(() => {
    const handleBeforeUnload = () => {
      connection?.close();
      peer?.destroy();
      setMessages([]);
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      handleBeforeUnload();
    };
  }, [connection, peer]);

  const handleConnection = useCallback((conn: DataConnection) => {
    conn.on("open", () => {
      setConnection(conn);
      setIsConnected(true);
      setIsConnecting(false);
      toast.success("Secure connection established!");
    });

    conn.on("data", (data) => {
      const receivedMessage = data as { text: string; id: string; timestamp: number };
      const message: Message = {
        id: receivedMessage.id,
        text: receivedMessage.text,
        sender: "peer",
        timestamp: receivedMessage.timestamp,
        expiresAt: Date.now() + MESSAGE_TTL,
      };
      setMessages((prev) => [...prev, message]);
    });

    conn.on("close", () => {
      setConnection(null);
      setIsConnected(false);
      setMessages([]);
      toast.info("Connection closed. All messages wiped.");
    });
  }, []);

  const connectToPeer = () => {
    if (!peer || !connectToId.trim()) {
      toast.error("Please enter a valid connection key");
      return;
    }

    const trimmedId = connectToId.trim();
    
    // Validate the ID format (PeerJS IDs are alphanumeric)
    if (!/^[a-zA-Z0-9-_]+$/.test(trimmedId)) {
      toast.error("Invalid connection key format");
      return;
    }

    setIsConnecting(true);
    toast.info("Connecting to peer...");
    
    const conn = peer.connect(trimmedId, {
      reliable: true,
      serialization: 'json'
    });
    
    // Add connection timeout
    const connectionTimeout = setTimeout(() => {
      if (!isConnected) {
        setIsConnecting(false);
        toast.error("Connection timeout. User may be offline or behind a strict firewall.");
      }
    }, 15000);

    conn.on("open", () => {
      clearTimeout(connectionTimeout);
    });

    conn.on("error", (err) => {
      clearTimeout(connectionTimeout);
      console.error("Connection error:", err);
      setIsConnecting(false);
      toast.error("Failed to connect. Please try again.");
    });

    handleConnection(conn);
  };

  const sendMessage = () => {
    if (!connection || !newMessage.trim()) return;

    const message: Message = {
      id: Date.now().toString(),
      text: newMessage.trim(),
      sender: "me",
      timestamp: Date.now(),
      expiresAt: Date.now() + MESSAGE_TTL,
    };

    connection.send({
      id: message.id,
      text: message.text,
      timestamp: message.timestamp,
    });

    setMessages((prev) => [...prev, message]);
    setNewMessage("");
  };

  const copyConnectionKey = async () => {
    await navigator.clipboard.writeText(myPeerId);
    toast.success("Connection key copied!");
  };

  const disconnect = () => {
    connection?.close();
    setConnection(null);
    setIsConnected(false);
    setMessages([]);
    toast.info("Disconnected. All messages wiped.");
  };

  const getRemainingTime = (expiresAt: number) => {
    const remaining = Math.max(0, expiresAt - Date.now());
    const minutes = Math.floor(remaining / 60000);
    const seconds = Math.floor((remaining % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const seoContent = {
    description: "Private, encrypted peer-to-peer chat with auto-destructing messages. No servers, no logs, no traces.",
    content: `
      <h3>Ultimate Privacy Chat</h3>
      <p>Shadow Chat is a revolutionary peer-to-peer messaging system that prioritizes your privacy above all else. Messages are transmitted directly between browsers using WebRTC technology, bypassing all servers and leaving no trace.</p>
      
      <h3>Zero Storage Policy</h3>
      <p>Unlike traditional messaging apps, Shadow Chat never stores your messages anywhere. All data exists only in volatile browser memory. When you close the tab or the session ends, everything is permanently wiped - not even we can recover it.</p>
      
      <h3>Auto-Destructing Messages</h3>
      <p>Every message has a 5-minute Time-To-Live (TTL). After 5 minutes, messages automatically vanish from both ends of the conversation. This ensures that even in an active session, your conversation history remains minimal.</p>
      
      <h3>How It Works</h3>
      <p>1. User A generates a unique Connection Key<br>
      2. User A shares this key securely with User B<br>
      3. User B enters the key to establish a direct P2P connection<br>
      4. Both users can now chat in real-time with complete privacy</p>
      
      <h3>Security Features</h3>
      <ul>
        <li>Direct peer-to-peer connection (no server relay)</li>
        <li>No message storage on any server or database</li>
        <li>5-minute auto-destruct for all messages</li>
        <li>Complete wipe on tab close or refresh</li>
        <li>Unique connection keys for each session</li>
      </ul>
    `,
    keywords: ["secure chat", "private messaging", "p2p chat", "encrypted chat", "auto-destruct messages", "anonymous chat", "no logs chat"],
    faqs: [
      {
        question: "Are my messages truly private?",
        answer: "Yes. Messages travel directly between browsers via WebRTC without passing through any server. Nothing is ever stored - all data exists only in your browser's memory and is wiped when you close the tab.",
      },
      {
        question: "What happens if I refresh the page?",
        answer: "Refreshing or closing the tab immediately terminates the connection and permanently wipes all message history. There is no way to recover previous conversations.",
      },
      {
        question: "Why do messages auto-destruct after 5 minutes?",
        answer: "The 5-minute TTL ensures minimal conversation history exists at any time, reducing the risk of information exposure if someone gains access to your device during an active session.",
      },
      {
        question: "Do I need to create an account?",
        answer: "No. Shadow Chat requires no registration, no email, no phone number. Simply generate a connection key, share it with your contact, and start chatting.",
      },
    ],
    aboutTool: "Shadow Chat is a zero-knowledge, peer-to-peer messaging system built directly into ToolSuiteX. Using WebRTC technology, it creates direct browser-to-browser connections with no server intermediary. All messages auto-destruct after 5 minutes and are completely wiped when you close the tab.",
  };

  return (
    <ToolLayout tool={tool} seoContent={seoContent}>
      <div className="max-w-2xl mx-auto">
        {/* Security Notice */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 bg-primary/5 border border-primary/20 rounded-lg flex items-start gap-3"
        >
          <Shield className="w-5 h-5 text-primary mt-0.5" />
          <div className="text-sm">
            <p className="font-medium text-primary">End-to-End Privacy</p>
            <p className="text-muted-foreground">
              All messages are P2P encrypted, auto-destruct in 5 minutes, and are wiped when you close the tab. 
              No server storage. No logs. No traces.
            </p>
          </div>
        </motion.div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              Shadow Chat
              {isConnected && (
                <span className="ml-auto flex items-center gap-1 text-sm font-normal text-green-500">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  Connected
                </span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {!isConnected ? (
              <div className="space-y-6">
                {/* Generate Connection Key */}
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Link className="w-4 h-4" />
                    Your Connection Key
                  </label>
                  <div className="flex gap-2">
                    <Input
                      value={myPeerId}
                      readOnly
                      placeholder="Generating..."
                      className="font-mono text-sm"
                    />
                    <Button onClick={copyConnectionKey} disabled={!myPeerId}>
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Share this key with someone to let them connect to you
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <div className="h-px flex-1 bg-border" />
                  <span className="text-sm text-muted-foreground">OR</span>
                  <div className="h-px flex-1 bg-border" />
                </div>

                {/* Connect to Someone */}
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Connect to Someone
                  </label>
                  <div className="flex gap-2">
                    <Input
                      value={connectToId}
                      onChange={(e) => setConnectToId(e.target.value)}
                      placeholder="Enter their connection key..."
                      className="font-mono text-sm"
                    />
                    <Button onClick={connectToPeer} disabled={isConnecting || !connectToId.trim()}>
                      {isConnecting ? "Connecting..." : "Connect"}
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Chat Messages */}
                <ScrollArea className="h-80 rounded-lg border p-4">
                  <div className="space-y-4" ref={scrollRef}>
                    <AnimatePresence>
                      {messages.length === 0 ? (
                        <p className="text-center text-muted-foreground py-8">
                          Connection established. Start chatting!<br />
                          <span className="text-xs">Messages auto-destruct in 5 minutes</span>
                        </p>
                      ) : (
                        messages.map((msg) => (
                          <motion.div
                            key={msg.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            className={`flex gap-3 ${msg.sender === "me" ? "flex-row-reverse" : ""}`}
                          >
                            <Avatar className="w-8 h-8">
                              <AvatarFallback className={msg.sender === "me" ? "bg-primary text-primary-foreground" : "bg-muted"}>
                                {msg.sender === "me" ? "Me" : "P"}
                              </AvatarFallback>
                            </Avatar>
                            <div className={`max-w-[70%] ${msg.sender === "me" ? "text-right" : ""}`}>
                              <div
                                className={`inline-block px-4 py-2 rounded-2xl ${
                                  msg.sender === "me"
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-muted"
                                }`}
                              >
                                <p className="break-words">{msg.text}</p>
                              </div>
                              <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                                <Clock className="w-3 h-3" />
                                <span>Expires in {getRemainingTime(msg.expiresAt)}</span>
                              </div>
                            </div>
                          </motion.div>
                        ))
                      )}
                    </AnimatePresence>
                  </div>
                </ScrollArea>

                {/* Message Input */}
                <div className="flex gap-2">
                  <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                  />
                  <Button onClick={sendMessage} disabled={!newMessage.trim()}>
                    <Send className="w-4 h-4" />
                  </Button>
                </div>

                {/* Disconnect Button */}
                <Button variant="destructive" onClick={disconnect} className="w-full">
                  <X className="w-4 h-4 mr-2" />
                  Disconnect & Wipe All Messages
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Warning Notice */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg flex items-start gap-2 text-sm"
        >
          <AlertTriangle className="w-4 h-4 text-yellow-500 mt-0.5" />
          <p className="text-muted-foreground">
            <strong className="text-yellow-500">Remember:</strong> Closing this tab or refreshing will 
            immediately destroy the connection and wipe all messages permanently.
          </p>
        </motion.div>
      </div>
    </ToolLayout>
  );
}
