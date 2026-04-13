import { useMemo, useState } from "react";
import { addDoc, collection } from "firebase/firestore";
import clsx from "clsx";
import {
  Bot,
  Send,
  CheckCircle,
  Zap,
  AlertTriangle,
  Loader,
  Sparkles,
} from "lucide-react";
import { db } from "../../../firebase";
import { Button, Card } from "../../UI";

export default function AIAssistantTab({ clientId, installerId }) {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "👋 Hi! I'm your AI Solar Assistant. Describe any issue you're experiencing, and I'll help troubleshoot before creating a ticket.",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const troubleshootingKnowledge = useMemo(
    () => ({
      "not charging": {
        checks: [
          "Check if the inverter display shows a green light.",
          "Verify the circuit breaker is in the ON position.",
          "Inspect battery connections for loose or corroded terminals.",
          "Check whether sufficient sunlight is reaching the panels.",
        ],
        severity: "medium",
      },
      "low output": {
        checks: [
          "Clean the solar panels if they are dusty or dirty.",
          "Check for shading from trees, poles, or nearby buildings.",
          "Verify inverter temperature because overheating may reduce output.",
          "Check the battery state of charge.",
        ],
        severity: "low",
      },
      "inverter error": {
        checks: [
          "Note the exact inverter error code displayed.",
          "Check the inverter manual for the meaning of the code.",
          "Power cycle the inverter: off, wait 30 seconds, then back on.",
          "Check grid connection if this is a grid-tied system.",
        ],
        severity: "high",
      },
      "no power": {
        checks: [
          "Check the main circuit breaker.",
          "Verify the inverter is switched on.",
          "Check battery voltage level.",
          "Inspect all relevant system fuses.",
        ],
        severity: "high",
      },
      "battery not holding": {
        checks: [
          "Check the battery age and expected service life.",
          "Verify charging voltage from the solar controller.",
          "Inspect terminals for corrosion or sulfation.",
          "Test battery capacity with a suitable load test.",
        ],
        severity: "medium",
      },
    }),
    []
  );

  function analyzeIssue(userInput) {
    const normalized = userInput.toLowerCase();

    for (const [key, value] of Object.entries(troubleshootingKnowledge)) {
      if (normalized.includes(key)) return value;
    }

    return null;
  }

  async function generateAIResponse(userMessage) {
    const analysis = analyzeIssue(userMessage);

    if (!analysis) {
      return {
        content:
          "I understand you're experiencing an issue. Please provide more details.\n\nFor example:\n• Is your system not charging?\n• Are you seeing low power output?\n• Is there an error code on your inverter?\n• Are your batteries not holding charge?\n\nThe more details you provide, the better I can help.",
        suggestTicket: false,
      };
    }

    const severityEmoji = {
      low: "🟡",
      medium: "🟠",
      high: "🔴",
    };

    let response = `${severityEmoji[analysis.severity]} I’ve identified a likely issue. Let’s troubleshoot step by step:\n\n`;

    analysis.checks.forEach((check, index) => {
      response += `${index + 1}. ${check}\n`;
    });

    response +=
      "\n💡 Try these steps and let me know the results. If the issue persists, I can escalate it into a priority ticket.";

    return {
      content: response,
      suggestTicket: analysis.severity === "high",
      severity: analysis.severity,
    };
  }

  async function handleSend() {
    if (!input.trim()) return;

    const typedInput = input;

    const userMessage = {
      role: "user",
      content: typedInput,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    setTimeout(async () => {
      const aiResponse = await generateAIResponse(typedInput);

      const assistantMessage = {
        role: "assistant",
        content: aiResponse.content,
        timestamp: new Date(),
        suggestTicket: aiResponse.suggestTicket,
        severity: aiResponse.severity,
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setLoading(false);
    }, 1200);
  }

  async function createTicket() {
    try {
      await addDoc(collection(db, "tickets"), {
        title: "AI-Escalated Issue",
        description:
          messages[messages.length - 2]?.content ||
          "Issue escalated from AI assistant",
        clientId,
        installerId,
        status: "pending",
        priority: "high",
        createdAt: new Date().toISOString(),
      });

      alert("Priority ticket created successfully. Your installer will be notified.");
    } catch (error) {
      console.error("Error creating ticket:", error);
      alert("Failed to create ticket. Please try again.");
    }
  }

  return (
    <div className="space-y-6">
      <div className="rounded-[28px] border border-violet-200/70 bg-gradient-to-br from-violet-50 via-white to-fuchsia-50 p-6 shadow-sm dark:border-violet-900/40 dark:from-violet-900/20 dark:via-slate-900 dark:to-fuchsia-900/10">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-white/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-violet-700 dark:border-violet-500/20 dark:bg-violet-500/10 dark:text-violet-300">
              <Sparkles className="h-3.5 w-3.5" />
              AI Support
            </div>

            <h3 className="mt-3 flex items-center gap-2 text-2xl font-black tracking-tight text-slate-900 dark:text-white">
              <Bot className="h-6 w-6 text-violet-500" />
              AI Troubleshooting Assistant
            </h3>

            <p className="mt-2 text-sm sm:text-base text-slate-600 dark:text-slate-400">
              Get instant guidance for common solar system issues before raising a manual support ticket.
            </p>
          </div>

          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-300">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
            AI Online
          </div>
        </div>
      </div>

      <Card className="overflow-hidden rounded-[28px] border border-slate-200/70 dark:border-slate-800 dark:bg-slate-900">
        <div className="h-[500px] space-y-4 overflow-y-auto p-5 sm:p-6">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={clsx(
                  "max-w-[88%] rounded-3xl px-4 py-4 shadow-sm sm:max-w-[80%]",
                  msg.role === "user"
                    ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
                    : "border border-slate-200 bg-slate-50 text-slate-800 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-200"
                )}
              >
                <p className="whitespace-pre-line text-sm leading-6">{msg.content}</p>
                <p className="mt-2 text-xs opacity-70">
                  {msg.timestamp.toLocaleTimeString()}
                </p>

                {msg.suggestTicket && (
                  <Button
                    onClick={createTicket}
                    className="mt-4 rounded-2xl bg-red-500 text-white hover:bg-red-600"
                  >
                    <AlertTriangle className="h-4 w-4" />
                    Create Priority Ticket
                  </Button>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800">
                <Loader className="h-5 w-5 animate-spin text-slate-400" />
              </div>
            </div>
          )}
        </div>

        <div className="border-t border-slate-200 p-4 dark:border-slate-800">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Describe your issue... e.g. 'My panels aren't charging'"
              className="flex-1 rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none ring-0 transition focus:border-sky-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              disabled={loading}
            />

            <Button
              onClick={handleSend}
              disabled={loading || !input.trim()}
              className="rounded-2xl bg-sky-600 text-white hover:bg-sky-700 disabled:opacity-60"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
            <div className="inline-flex items-center gap-1.5">
              <CheckCircle className="h-3.5 w-3.5" />
              <span>Instant AI analysis</span>
            </div>
            <div className="inline-flex items-center gap-1.5">
              <Zap className="h-3.5 w-3.5" />
              <span>24/7 available</span>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="rounded-[24px] border border-emerald-200 bg-emerald-50 p-5 dark:border-emerald-900/30 dark:bg-emerald-900/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400">Tickets Prevented</p>
              <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400">127</p>
            </div>
            <CheckCircle className="h-8 w-8 text-emerald-500" />
          </div>
        </Card>

        <Card className="rounded-[24px] border border-sky-200 bg-sky-50 p-5 dark:border-sky-900/30 dark:bg-sky-900/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400">Avg Response</p>
              <p className="text-2xl font-black text-sky-600 dark:text-sky-400">2.3s</p>
            </div>
            <Zap className="h-8 w-8 text-sky-500" />
          </div>
        </Card>

        <Card className="rounded-[24px] border border-violet-200 bg-violet-50 p-5 dark:border-violet-900/30 dark:bg-violet-900/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400">Success Rate</p>
              <p className="text-2xl font-black text-violet-600 dark:text-violet-400">94%</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-violet-500" />
          </div>
        </Card>
      </div>
    </div>
  );
}