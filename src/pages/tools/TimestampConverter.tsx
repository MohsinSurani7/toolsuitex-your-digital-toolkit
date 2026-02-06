import { useState, useEffect } from "react";
import { ToolLayout } from "@/components/tools/ToolLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Copy, Clock, RefreshCw, ArrowRightLeft } from "lucide-react";
import { getToolById } from "@/lib/tools-data";
import { useToast } from "@/hooks/use-toast";

const TimestampConverter = () => {
  const [timestamp, setTimestamp] = useState("");
  const [dateString, setDateString] = useState("");
  const [currentTime, setCurrentTime] = useState(Date.now());
  const [unit, setUnit] = useState<"seconds" | "milliseconds">("seconds");
  const { toast } = useToast();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const timestampToDate = () => {
    if (!timestamp.trim()) return;
    
    let ts = parseInt(timestamp);
    if (isNaN(ts)) {
      toast({ title: "Error", description: "Invalid timestamp", variant: "destructive" });
      return;
    }

    // Convert to milliseconds if in seconds
    if (unit === "seconds") {
      ts *= 1000;
    }

    const date = new Date(ts);
    if (isNaN(date.getTime())) {
      toast({ title: "Error", description: "Invalid timestamp", variant: "destructive" });
      return;
    }

    setDateString(date.toISOString());
  };

  const dateToTimestamp = () => {
    if (!dateString.trim()) return;

    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      toast({ title: "Error", description: "Invalid date format", variant: "destructive" });
      return;
    }

    const ts = unit === "seconds" 
      ? Math.floor(date.getTime() / 1000)
      : date.getTime();
    
    setTimestamp(ts.toString());
  };

  const useCurrentTime = () => {
    const ts = unit === "seconds" 
      ? Math.floor(currentTime / 1000)
      : currentTime;
    setTimestamp(ts.toString());
    timestampToDate();
  };

  const copyValue = (value: string, label: string) => {
    navigator.clipboard.writeText(value);
    toast({ title: "Copied!", description: `${label} copied to clipboard` });
  };

  const formatDate = (date: Date) => {
    return {
      iso: date.toISOString(),
      utc: date.toUTCString(),
      local: date.toLocaleString(),
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString(),
      relative: getRelativeTime(date),
    };
  };

  const getRelativeTime = (date: Date) => {
    const diff = Date.now() - date.getTime();
    const seconds = Math.abs(diff / 1000);
    const minutes = seconds / 60;
    const hours = minutes / 60;
    const days = hours / 24;
    const years = days / 365;

    const isFuture = diff < 0;
    const prefix = isFuture ? "in " : "";
    const suffix = isFuture ? "" : " ago";

    if (seconds < 60) return `${prefix}${Math.floor(seconds)} seconds${suffix}`;
    if (minutes < 60) return `${prefix}${Math.floor(minutes)} minutes${suffix}`;
    if (hours < 24) return `${prefix}${Math.floor(hours)} hours${suffix}`;
    if (days < 365) return `${prefix}${Math.floor(days)} days${suffix}`;
    return `${prefix}${Math.floor(years)} years${suffix}`;
  };

  const parsedDate = dateString ? new Date(dateString) : null;
  const dateFormats = parsedDate && !isNaN(parsedDate.getTime()) ? formatDate(parsedDate) : null;

  const currentSeconds = Math.floor(currentTime / 1000);
  const currentMs = currentTime;

  const tool = getToolById("timestamp-converter")!;

  const seoContent = {
    introduction: "Unix timestamps are used everywhere in programming, databases, and APIs. Our Timestamp Converter makes it easy to convert between Unix timestamps and human-readable dates, with support for both seconds and milliseconds.",
    howItWorks: [
      "View the current time displayed in both timestamp formats",
      "Enter a timestamp to convert to human-readable date",
      "Or select a date to convert to timestamp",
      "Copy any format with one click"
    ],
    useCases: [
      { title: "API Development", description: "Convert timestamps from API responses to readable dates" },
      { title: "Database Queries", description: "Generate timestamps for date-based queries" },
      { title: "Log Analysis", description: "Translate log timestamps to understand when events occurred" }
    ],
    faq: [
      { question: "What's the difference between seconds and milliseconds?", answer: "Unix timestamps in seconds are 10 digits, while milliseconds are 13 digits. JavaScript uses milliseconds by default." },
      { question: "What timezone is used?", answer: "Timestamps are timezone-independent (UTC). The displayed local time uses your browser's timezone." }
    ]
  };

  return (
    <ToolLayout tool={tool} seoContent={seoContent}>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Current Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">Seconds</p>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-lg">{currentSeconds}</span>
                  <Button variant="ghost" size="icon" onClick={() => copyValue(currentSeconds.toString(), "Timestamp")}>
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">Milliseconds</p>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-lg">{currentMs}</span>
                  <Button variant="ghost" size="icon" onClick={() => copyValue(currentMs.toString(), "Timestamp")}>
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
            <p className="text-center mt-4 text-muted-foreground">
              {new Date(currentTime).toLocaleString()}
            </p>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Timestamp to Date</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Unix Timestamp</Label>
                <div className="flex gap-2">
                  <Input
                    value={timestamp}
                    onChange={(e) => setTimestamp(e.target.value)}
                    placeholder="1704067200"
                    className="font-mono"
                  />
                  <Select value={unit} onValueChange={(v) => setUnit(v as "seconds" | "milliseconds")}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="seconds">Seconds</SelectItem>
                      <SelectItem value="milliseconds">Milliseconds</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button onClick={timestampToDate} className="flex-1">
                  <ArrowRightLeft className="w-4 h-4 mr-2" />
                  Convert
                </Button>
                <Button variant="outline" onClick={useCurrentTime}>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Now
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Date to Timestamp</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Date String</Label>
                <Input
                  type="datetime-local"
                  value={dateString ? dateString.slice(0, 16) : ""}
                  onChange={(e) => setDateString(new Date(e.target.value).toISOString())}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Or ISO 8601</Label>
                <Input
                  value={dateString}
                  onChange={(e) => setDateString(e.target.value)}
                  placeholder="2024-01-01T00:00:00.000Z"
                  className="font-mono text-sm"
                />
              </div>
              
              <Button onClick={dateToTimestamp} className="w-full">
                <ArrowRightLeft className="w-4 h-4 mr-2" />
                Convert
              </Button>
            </CardContent>
          </Card>
        </div>

        {dateFormats && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Date Formats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                {Object.entries(dateFormats).map(([key, value]) => (
                  <div key={key} className="p-3 bg-muted rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1 capitalize">{key.replace(/([A-Z])/g, " $1")}</p>
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono text-sm truncate">{value}</span>
                      <Button variant="ghost" size="icon" className="shrink-0" onClick={() => copyValue(value, key)}>
                        <Copy className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </ToolLayout>
  );
};

export default TimestampConverter;
