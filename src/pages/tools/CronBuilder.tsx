import { useState } from "react";
import { ToolLayout } from "@/components/tools/ToolLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Copy, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getToolById } from "@/lib/tools-data";

const presets = [
  { name: "Every minute", cron: "* * * * *" },
  { name: "Every 5 minutes", cron: "*/5 * * * *" },
  { name: "Every 15 minutes", cron: "*/15 * * * *" },
  { name: "Every hour", cron: "0 * * * *" },
  { name: "Every day at midnight", cron: "0 0 * * *" },
  { name: "Every day at noon", cron: "0 12 * * *" },
  { name: "Every Sunday", cron: "0 0 * * 0" },
  { name: "Every Monday at 9 AM", cron: "0 9 * * 1" },
  { name: "First day of month", cron: "0 0 1 * *" },
  { name: "Every weekday at 9 AM", cron: "0 9 * * 1-5" },
];

const CronBuilder = () => {
  const [minute, setMinute] = useState("*");
  const [hour, setHour] = useState("*");
  const [dayOfMonth, setDayOfMonth] = useState("*");
  const [month, setMonth] = useState("*");
  const [dayOfWeek, setDayOfWeek] = useState("*");
  const { toast } = useToast();

  const cronExpression = `${minute} ${hour} ${dayOfMonth} ${month} ${dayOfWeek}`;

  const getHumanReadable = () => {
    const parts: string[] = [];

    // Minute
    if (minute === "*") parts.push("every minute");
    else if (minute.startsWith("*/")) parts.push(`every ${minute.slice(2)} minutes`);
    else parts.push(`at minute ${minute}`);

    // Hour
    if (hour === "*") parts.push("of every hour");
    else if (hour.startsWith("*/")) parts.push(`every ${hour.slice(2)} hours`);
    else parts.push(`at ${hour}:00`);

    // Day of month
    if (dayOfMonth !== "*") {
      if (dayOfMonth.startsWith("*/")) parts.push(`every ${dayOfMonth.slice(2)} days`);
      else parts.push(`on day ${dayOfMonth}`);
    }

    // Month
    if (month !== "*") {
      const months = ["", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
      parts.push(`in ${months[parseInt(month)] || month}`);
    }

    // Day of week
    if (dayOfWeek !== "*") {
      const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
      if (dayOfWeek === "1-5") parts.push("on weekdays");
      else if (dayOfWeek === "0,6") parts.push("on weekends");
      else parts.push(`on ${days[parseInt(dayOfWeek)] || dayOfWeek}`);
    }

    return parts.join(" ");
  };

  const humanReadable = getHumanReadable();
    }

  const applyPreset = (cron: string) => {
    const parts = cron.split(" ");
    setMinute(parts[0]);
    setHour(parts[1]);
    setDayOfMonth(parts[2]);
    setMonth(parts[3]);
    setDayOfWeek(parts[4]);
  };

  const copyExpression = () => {
    navigator.clipboard.writeText(cronExpression);
    toast({ title: "Copied!", description: "Cron expression copied to clipboard" });
  };

  const tool = getToolById("cron-builder")!;

  const seoContent = {
    introduction: "Cron expressions can be confusing. Our visual Cron Builder helps you create and understand cron schedules with an intuitive interface, preset templates, and human-readable explanations.",
    howItWorks: [
      "Use the visual builder to set minute, hour, day, month, and weekday values",
      "Or select from common presets like 'Every hour' or 'Daily at midnight'",
      "View the generated cron expression and its human-readable meaning",
      "Copy the expression for use in your cron jobs or scheduled tasks"
    ],
    useCases: [
      { title: "Server Automation", description: "Schedule backup scripts, cleanup jobs, or maintenance tasks" },
      { title: "Task Scheduling", description: "Set up recurring jobs in CI/CD pipelines or cloud functions" },
      { title: "Learning Cron", description: "Understand cron syntax through visual experimentation" }
    ],
    faq: [
      { question: "What's the cron format?", answer: "Standard 5-field format: minute (0-59), hour (0-23), day of month (1-31), month (1-12), day of week (0-6)." },
      { question: "What does * mean?", answer: "Asterisk means 'every' - so * in the hour field means 'every hour'." }
    ]
  };

  return (
    <ToolLayout tool={tool} seoContent={seoContent}>
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Build Expression</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-5 gap-2 text-center text-xs text-muted-foreground mb-2">
                <span>Minute</span>
                <span>Hour</span>
                <span>Day (M)</span>
                <span>Month</span>
                <span>Day (W)</span>
              </div>
              
              <div className="grid grid-cols-5 gap-2">
                <Input value={minute} onChange={(e) => setMinute(e.target.value)} className="text-center font-mono" />
                <Input value={hour} onChange={(e) => setHour(e.target.value)} className="text-center font-mono" />
                <Input value={dayOfMonth} onChange={(e) => setDayOfMonth(e.target.value)} className="text-center font-mono" />
                <Input value={month} onChange={(e) => setMonth(e.target.value)} className="text-center font-mono" />
                <Input value={dayOfWeek} onChange={(e) => setDayOfWeek(e.target.value)} className="text-center font-mono" />
              </div>

              <div className="space-y-2">
                <Label>Quick Select - Minute</Label>
                <Select value={minute} onValueChange={setMinute}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="*">Every minute (*)</SelectItem>
                    <SelectItem value="*/5">Every 5 minutes (*/5)</SelectItem>
                    <SelectItem value="*/15">Every 15 minutes (*/15)</SelectItem>
                    <SelectItem value="*/30">Every 30 minutes (*/30)</SelectItem>
                    <SelectItem value="0">At minute 0 (0)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Quick Select - Hour</Label>
                <Select value={hour} onValueChange={setHour}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="*">Every hour (*)</SelectItem>
                    <SelectItem value="*/2">Every 2 hours (*/2)</SelectItem>
                    <SelectItem value="0">Midnight (0)</SelectItem>
                    <SelectItem value="9">9 AM (9)</SelectItem>
                    <SelectItem value="12">Noon (12)</SelectItem>
                    <SelectItem value="18">6 PM (18)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Quick Select - Day of Week</Label>
                <Select value={dayOfWeek} onValueChange={setDayOfWeek}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="*">Every day (*)</SelectItem>
                    <SelectItem value="1-5">Weekdays (1-5)</SelectItem>
                    <SelectItem value="0,6">Weekends (0,6)</SelectItem>
                    <SelectItem value="0">Sunday (0)</SelectItem>
                    <SelectItem value="1">Monday (1)</SelectItem>
                    <SelectItem value="5">Friday (5)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Common Presets</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2">
                {presets.map((preset) => (
                  <Button
                    key={preset.name}
                    variant="outline"
                    size="sm"
                    onClick={() => applyPreset(preset.cron)}
                    className="justify-start text-xs"
                  >
                    {preset.name}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Expression
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  value={cronExpression}
                  readOnly
                  className="font-mono text-lg text-center"
                />
                <Button onClick={copyExpression}>
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm font-medium mb-1">Human Readable:</p>
                <p className="text-muted-foreground">{humanReadable}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Syntax Reference</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <span className="font-mono">*</span>
                  <span className="text-muted-foreground">Any value</span>
                  <span className="font-mono">*/n</span>
                  <span className="text-muted-foreground">Every n units</span>
                  <span className="font-mono">1,3,5</span>
                  <span className="text-muted-foreground">Specific values</span>
                  <span className="font-mono">1-5</span>
                  <span className="text-muted-foreground">Range of values</span>
                </div>
                
                <div className="mt-4 pt-4 border-t">
                  <p className="font-medium mb-2">Field Ranges:</p>
                  <div className="grid grid-cols-2 gap-1 text-xs">
                    <span>Minute</span><span className="text-muted-foreground">0-59</span>
                    <span>Hour</span><span className="text-muted-foreground">0-23</span>
                    <span>Day of month</span><span className="text-muted-foreground">1-31</span>
                    <span>Month</span><span className="text-muted-foreground">1-12</span>
                    <span>Day of week</span><span className="text-muted-foreground">0-6 (Sun-Sat)</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ToolLayout>
  );
};

export default CronBuilder;
