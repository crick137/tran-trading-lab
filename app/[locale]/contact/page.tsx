"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Send, Mail, MessageCircle, Check, Loader2 } from "lucide-react";

export default function ContactPage() {
    const [formData, setFormData] = useState({ name: "", email: "", message: "" });
    const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus("loading");
        await new Promise(r => setTimeout(r, 1500));
        setStatus("success");
        setFormData({ name: "", email: "", message: "" });
        setTimeout(() => setStatus("idle"), 3000);
    };

    return (
        <>
            <Navbar />
            <main className="pt-24 pb-16 min-h-screen">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <Breadcrumb items={[{ label: "문의하기" }]} />

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center mb-12"
                    >
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gold/10 mb-6">
                            <MessageCircle className="w-8 h-8 text-gold" />
                        </div>
                        <h1 className="text-4xl font-bold text-foreground mb-4">문의하기</h1>
                        <p className="text-lg text-muted-foreground">
                            질문이나 제안이 있으시면 언제든 연락해 주세요.
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Contact Methods */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 }}
                            className="space-y-4"
                        >
                            <h2 className="text-xl font-semibold text-foreground mb-4">빠른 연락</h2>

                            <a
                                href="https://t.me/TranTradingLab"
                                target="_blank"
                                className="flex items-center gap-4 p-4 rounded-lg bg-card border border-border/50 hover:border-gold/50 transition-all group"
                            >
                                <div className="w-12 h-12 rounded-lg bg-[#229ED9]/10 flex items-center justify-center">
                                    <Send className="w-6 h-6 text-[#229ED9]" />
                                </div>
                                <div>
                                    <h3 className="font-medium text-foreground group-hover:text-gold transition-colors">텔레그램</h3>
                                    <p className="text-sm text-muted-foreground">가장 빠른 응답</p>
                                </div>
                            </a>

                            <a
                                href="mailto:contact@trantradinglab.com"
                                className="flex items-center gap-4 p-4 rounded-lg bg-card border border-border/50 hover:border-gold/50 transition-all group"
                            >
                                <div className="w-12 h-12 rounded-lg bg-gold/10 flex items-center justify-center">
                                    <Mail className="w-6 h-6 text-gold" />
                                </div>
                                <div>
                                    <h3 className="font-medium text-foreground group-hover:text-gold transition-colors">이메일</h3>
                                    <p className="text-sm text-muted-foreground">contact@trantradinglab.com</p>
                                </div>
                            </a>

                            <div className="p-4 rounded-lg bg-card/50 border border-border/50 mt-6">
                                <p className="text-sm text-muted-foreground">
                                    ⏰ 응답 시간: 보통 24시간 이내<br />
                                    텔레그램을 통한 문의가 가장 빠릅니다.
                                </p>
                            </div>
                        </motion.div>

                        {/* Contact Form */}
                        <motion.form
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            onSubmit={handleSubmit}
                            className="space-y-4"
                        >
                            <h2 className="text-xl font-semibold text-foreground mb-4">메시지 보내기</h2>

                            <div>
                                <label className="block text-sm text-muted-foreground mb-2">이름</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-4 py-3 rounded-lg bg-card border border-border/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-gold/50"
                                    placeholder="홍길동"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm text-muted-foreground mb-2">이메일</label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full px-4 py-3 rounded-lg bg-card border border-border/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-gold/50"
                                    placeholder="email@example.com"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm text-muted-foreground mb-2">메시지</label>
                                <textarea
                                    value={formData.message}
                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                    rows={5}
                                    className="w-full px-4 py-3 rounded-lg bg-card border border-border/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-gold/50 resize-none"
                                    placeholder="문의 내용을 입력해 주세요..."
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={status !== "idle"}
                                className={`w-full py-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${status === "success"
                                        ? "bg-green-500 text-white"
                                        : "bg-gradient-to-r from-gold to-gold-light text-background hover:shadow-lg hover:shadow-gold/30"
                                    }`}
                            >
                                {status === "loading" && <Loader2 className="w-5 h-5 animate-spin" />}
                                {status === "success" && <Check className="w-5 h-5" />}
                                {status === "idle" && "보내기"}
                                {status === "loading" && "전송 중..."}
                                {status === "success" && "전송 완료!"}
                            </button>
                        </motion.form>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}
