import { useState } from "react";
import { addDoc, collection } from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  MessageSquareText,
  Clock3,
  ShieldAlert,
  Sparkles,
  Plus,
} from "lucide-react";
import { db } from "../../../firebase";
import { Button, Card, Badge, Input, Textarea, EmptyState } from "../../UI";

export default function TicketsTab({
  tickets = [],
  clientId,
  clientName,
  installerId,
}) {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();

    if (!formData.title.trim() || !formData.description.trim()) return;

    try {
      setSubmitting(true);

      await addDoc(collection(db, "tickets"), {
        ...formData,
        clientId,
        clientName,
        installerId,
        status: "pending",
        createdAt: new Date().toISOString(),
      });

      setFormData({ title: "", description: "" });
      setShowForm(false);
    } catch (error) {
      console.error("Error creating ticket:", error);
      alert("Failed to submit ticket. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="rounded-[28px] border border-slate-200/70 bg-gradient-to-br from-slate-50 to-white p-6 shadow-sm dark:border-slate-800 dark:from-slate-900 dark:to-slate-950">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-amber-700 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-300">
              <Sparkles className="h-3.5 w-3.5" />
              Support Desk
            </div>

            <h3 className="mt-3 text-2xl font-black tracking-tight text-slate-900 dark:text-white">
              My Support Tickets
            </h3>

            <p className="mt-2 text-sm sm:text-base text-slate-600 dark:text-slate-400">
              Track your requests and raise a new support issue whenever you need help.
            </p>
          </div>

          <Button
            onClick={() => setShowForm((prev) => !prev)}
            className="w-full sm:w-auto rounded-2xl bg-slate-900 px-5 py-3 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
          >
            <Plus className="h-4 w-4" />
            {showForm ? "Close Form" : "New Ticket"}
          </Button>
        </div>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            <Card className="overflow-hidden rounded-[28px] border border-slate-200/70 p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="mb-5">
                <h4 className="text-lg font-bold text-slate-900 dark:text-white">
                  Create a New Ticket
                </h4>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                  Provide a clear title and describe the issue in detail.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  value={formData.title}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, title: e.target.value }))
                  }
                  placeholder="Ticket title"
                />

                <Textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  rows={5}
                  placeholder="Describe the issue you’re experiencing..."
                />

                <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                  <Button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="rounded-2xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                  >
                    Cancel
                  </Button>

                  <Button
                    type="submit"
                    disabled={submitting}
                    className="rounded-2xl bg-sky-600 text-white hover:bg-sky-700 disabled:opacity-60"
                  >
                    <Send className="h-4 w-4" />
                    {submitting ? "Submitting..." : "Submit Ticket"}
                  </Button>
                </div>
              </form>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {tickets.length === 0 ? (
        <EmptyState
          icon={MessageSquareText}
          title="No support tickets yet"
          description="You haven’t created any support tickets yet."
        />
      ) : (
        <div className="space-y-4">
          {tickets.map((ticket, index) => (
            <motion.div
              key={ticket.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.04 }}
            >
              <Card className="rounded-[26px] border border-slate-200/70 p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="text-lg font-bold text-slate-900 dark:text-white">
                        {ticket.title}
                      </h4>

                      <Badge
                        className={
                          ticket.status === "resolved"
                            ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300"
                            : "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300"
                        }
                      >
                        {ticket.status || "pending"}
                      </Badge>
                    </div>

                    <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-slate-600 dark:text-slate-400">
                      {ticket.description}
                    </p>

                    <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
                      <div className="inline-flex items-center gap-2">
                        <Clock3 className="h-4 w-4" />
                        <span>
                          {ticket.createdAt
                            ? new Date(ticket.createdAt).toLocaleString()
                            : "Recently submitted"}
                        </span>
                      </div>

                      {ticket.status !== "resolved" && (
                        <div className="inline-flex items-center gap-2">
                          <ShieldAlert className="h-4 w-4" />
                          <span>Awaiting installer response</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}