import { useState, useMemo } from "react";
import { ToolLayout } from "@/components/tools/ToolLayout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Copy, AlertTriangle, CheckCircle, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getToolById } from "@/lib/tools-data";

interface DecodedJWT {
  header: any;
  payload: any;
  signature: string;
  isExpired: boolean;
  expiresAt?: Date;
  issuedAt?: Date;
}

const JwtDecoder = () => {
  const [token, setToken] = useState("");
  const { toast } = useToast();

  const decoded = useMemo((): DecodedJWT | null => {
    if (!token.trim()) return null;

    try {
      const parts = token.split(".");
      if (parts.length !== 3) throw new Error("Invalid JWT format");

      const header = JSON.parse(atob(parts[0].replace(/-/g, "+").replace(/_/g, "/")));
      const payload = JSON.parse(atob(parts[1].replace(/-/g, "+").replace(/_/g, "/")));
      const signature = parts[2];

      const now = Math.floor(Date.now() / 1000);
      const isExpired = payload.exp ? payload.exp < now : false;
      const expiresAt = payload.exp ? new Date(payload.exp * 1000) : undefined;
      const issuedAt = payload.iat ? new Date(payload.iat * 1000) : undefined;

      return { header, payload, signature, isExpired, expiresAt, issuedAt };
    } catch {
      return null;
    }
  }, [token]);

  const copyJSON = (obj: any, label: string) => {
    navigator.clipboard.writeText(JSON.stringify(obj, null, 2));
    toast({ title: "Copied!", description: `${label} copied to clipboard` });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleString();
  };

  const getClaimDescription = (key: string): string => {
    const claims: Record<string, string> = {
      iss: "Issuer",
      sub: "Subject",
      aud: "Audience",
      exp: "Expiration Time",
      nbf: "Not Before",
      iat: "Issued At",
      jti: "JWT ID",
      name: "Full Name",
      email: "Email Address",
      role: "Role",
      permissions: "Permissions",
    };
    return claims[key] || key;
  };

  const tool = getToolById("jwt-decoder")!;

  const seoContent = {
    description: "Decode and inspect JSON Web Tokens (JWT) to view header and payload data with expiration checking.",
    content: `<h3>Introduction to JWT</h3><p>JSON Web Tokens (JWT) are widely used for authentication and data exchange. Our JWT Decoder lets you inspect token contents, check expiration status, and understand the claims without any server-side processing.</p><h3>How to Use</h3><p>Paste your JWT token (starts with 'eyJ...'), view the decoded header showing algorithm and token type, inspect the payload with all claims and their values, and check token expiration status.</p><h3>Key Features</h3><ul><li>Decode header and payload</li><li>Expiration time checking</li><li>Claim inspection</li><li>Copy decoded data</li></ul>`,
    keywords: ["jwt decoder", "json web token", "jwt inspector", "token decoder", "jwt debugger"],
    faqs: [
      { question: "Does this verify the signature?", answer: "No, this tool only decodes the token. Signature verification requires the secret key and should be done server-side." },
      { question: "Is my token secure?", answer: "Yes, all processing happens in your browser. Tokens are never sent to any server." }
    ],
    aboutTool: "Our JWT Decoder helps you inspect and debug JSON Web Tokens instantly. Perfect for developers working with authentication and API integrations."
  };

  return (
    <ToolLayout tool={tool} seoContent={seoContent}>
      <div className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">JWT Token</label>
          <Textarea
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="Paste your JWT token here (eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...)"
            className="min-h-[120px] font-mono text-sm"
          />
        </div>

        {token && !decoded && (
          <Card className="border-destructive">
            <CardContent className="p-4 flex items-center gap-2 text-destructive">
              <AlertTriangle className="w-5 h-5" />
              <span>Invalid JWT format. Token should have 3 parts separated by dots.</span>
            </CardContent>
          </Card>
        )}

        {decoded && (
          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center justify-between">
                  Header
                  <Button variant="ghost" size="sm" onClick={() => copyJSON(decoded.header, "Header")}>
                    <Copy className="w-4 h-4" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">
                  {JSON.stringify(decoded.header, null, 2)}
                </pre>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Badge variant="secondary">Algorithm: {decoded.header.alg}</Badge>
                  <Badge variant="secondary">Type: {decoded.header.typ}</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    Payload
                    {decoded.isExpired ? (
                      <Badge variant="destructive">
                        <AlertTriangle className="w-3 h-3 mr-1" />
                        Expired
                      </Badge>
                    ) : decoded.expiresAt ? (
                      <Badge variant="secondary">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Valid
                      </Badge>
                    ) : null}
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => copyJSON(decoded.payload, "Payload")}>
                    <Copy className="w-4 h-4" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto max-h-[200px]">
                  {JSON.stringify(decoded.payload, null, 2)}
                </pre>
              </CardContent>
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Token Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {Object.entries(decoded.payload).map(([key, value]) => (
                    <div key={key} className="p-3 bg-muted rounded-lg">
                      <p className="text-xs text-muted-foreground mb-1">{getClaimDescription(key)}</p>
                      <p className="font-mono text-sm break-all">
                        {key === "exp" || key === "iat" || key === "nbf"
                          ? formatDate(new Date((value as number) * 1000))
                          : typeof value === "object"
                          ? JSON.stringify(value)
                          : String(value)}
                      </p>
                    </div>
                  ))}
                </div>

                {decoded.expiresAt && (
                  <div className="mt-4 p-4 border rounded-lg">
                    <div className="flex items-center gap-4 flex-wrap">
                      {decoded.issuedAt && (
                        <div>
                          <p className="text-xs text-muted-foreground">Issued At</p>
                          <p className="font-medium">{formatDate(decoded.issuedAt)}</p>
                        </div>
                      )}
                      <div>
                        <p className="text-xs text-muted-foreground">Expires At</p>
                        <p className={`font-medium ${decoded.isExpired ? "text-destructive" : "text-primary"}`}>
                          {formatDate(decoded.expiresAt)}
                        </p>
                      </div>
                      {!decoded.isExpired && decoded.expiresAt && (
                        <div>
                          <p className="text-xs text-muted-foreground">Time Remaining</p>
                          <p className="font-medium text-primary">
                            {Math.floor((decoded.expiresAt.getTime() - Date.now()) / 1000 / 60)} minutes
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-lg">Signature</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="p-4 bg-muted rounded-lg font-mono text-sm break-all">
                  {decoded.signature}
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  ⚠️ This tool only decodes the JWT. It does not verify the signature.
                  Server-side verification is required for security.
                </p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </ToolLayout>
  );
};

export default JwtDecoder;
