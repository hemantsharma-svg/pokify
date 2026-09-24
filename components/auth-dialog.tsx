"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useApp } from "@/lib/store";
import { Loader2, Music, User, Lock, Eye, EyeOff, CheckCircle, KeyRound } from "lucide-react";

interface AuthDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type Mode = "login" | "signup" | "forgot";

export function AuthDialog({ open, onOpenChange }: AuthDialogProps) {
  const { login, signup } = useApp();
  const [mode, setMode] = useState<Mode>("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [resetToken, setResetToken] = useState("");
  const [resetCodeInput, setResetCodeInput] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [resetSuccess, setResetSuccess] = useState(false);

  const reset = () => {
    setUsername("");
    setPassword("");
    setDisplayName("");
    setError("");
    setShowPassword(false);
    setResetToken("");
    setResetCodeInput("");
    setNewPassword("");
    setResetSuccess(false);
  };

  const switchMode = (m: Mode) => {
    setMode(m);
    reset();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const result =
      mode === "login" ? await login(username.trim(), password) : await signup(username.trim(), password, displayName.trim());
    setLoading(false);
    if (!result.success) {
      setError(result.error || "Something went wrong.");
      return;
    }
    reset();
    onOpenChange(false);
  };

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/forgot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not find that account.");
      setResetToken(data.token);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: resetCodeInput.trim(), password: newPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not reset your password.");
      setResetSuccess(true);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        onOpenChange(o);
        if (!o) reset();
        if (!o) setMode("login");
      }}
    >
      <DialogContent className="overflow-hidden border-neutral-800 bg-neutral-950 p-0 text-white sm:max-w-md">
        <div className="bg-gradient-to-br from-green-600/20 via-neutral-950 to-neutral-950 px-6 pb-5 pt-6">
          <DialogHeader>
            <div className="mb-1 flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-green-500">
                <Music className="h-5 w-5 text-black" />
              </div>
              <DialogTitle className="text-xl font-bold">
                {mode === "login" && "Log in to Pokify"}
                {mode === "signup" && "Sign up for Pokify"}
                {mode === "forgot" && "Reset your password"}
              </DialogTitle>
            </div>
            <p className="pl-11 text-sm text-neutral-400">
              {mode === "forgot"
                ? "We'll generate a one-time code to get you back in."
                : "Millions of songs. Free on Pokify."}
            </p>
          </DialogHeader>
        </div>

        <div className="px-6 pb-6">
          {mode !== "forgot" && (
            <Tabs value={mode} onValueChange={(v) => switchMode(v as Mode)}>
              <TabsList className="grid w-full grid-cols-2 bg-neutral-800">
                <TabsTrigger value="login">Log in</TabsTrigger>
                <TabsTrigger value="signup">Sign up</TabsTrigger>
              </TabsList>
              <TabsContent value={mode} className="mt-5">
                <form onSubmit={handleSubmit} className="space-y-4">
                  {mode === "signup" && (
                    <div className="space-y-2">
                      <Label htmlFor="displayName">Display name (optional)</Label>
                      <div className="relative">
                        <User className="pokify-input-icon" />
                        <Input
                          id="displayName"
                          value={displayName}
                          onChange={(e) => setDisplayName(e.target.value)}
                          placeholder="Jamie"
                          className="pokify-input"
                        />
                      </div>
                    </div>
                  )}
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <div className="relative">
                      <User className="pokify-input-icon" />
                      <Input
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="jamie_music"
                        className="pokify-input"
                        autoFocus
                        required
                        minLength={3}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password">Password</Label>
                      {mode === "login" && (
                        <button
                          type="button"
                          onClick={() => switchMode("forgot")}
                          className="text-xs font-semibold text-green-400 hover:text-green-300 hover:underline"
                        >
                          Forgot password?
                        </button>
                      )}
                    </div>
                    <div className="relative">
                      <Lock className="pokify-input-icon" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="At least 6 characters"
                        className="pokify-input pr-10"
                        required
                        minLength={6}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((s) => !s)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-300"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  {error && (
                    <Alert className="border-red-900/50 bg-red-950/50 py-2">
                      <AlertDescription className="text-sm text-red-300">{error}</AlertDescription>
                    </Alert>
                  )}
                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-full bg-green-500 py-6 font-semibold text-black transition hover:scale-[1.01] hover:bg-green-400"
                  >
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {mode === "login" ? "Log in" : "Create account"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          )}

          {mode === "forgot" && !resetToken && (
            <form onSubmit={handleRequestReset} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="forgot-username">Username</Label>
                <div className="relative">
                  <User className="pokify-input-icon" />
                  <Input
                    id="forgot-username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="jamie_music"
                    className="pokify-input"
                    autoFocus
                    required
                  />
                </div>
              </div>
              {error && (
                <Alert className="border-red-900/50 bg-red-950/50 py-2">
                  <AlertDescription className="text-sm text-red-300">{error}</AlertDescription>
                </Alert>
              )}
              <Button
                type="submit"
                disabled={loading}
                className="w-full rounded-full bg-green-500 py-6 font-semibold text-black hover:bg-green-400"
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Get reset code
              </Button>
              <button
                type="button"
                onClick={() => switchMode("login")}
                className="w-full text-center text-sm text-neutral-400 hover:text-white hover:underline"
              >
                Back to log in
              </button>
            </form>
          )}

          {mode === "forgot" && resetToken && !resetSuccess && (
            <form onSubmit={handleConfirmReset} className="space-y-4">
              <Alert className="border-green-900/50 bg-green-950/40 py-3">
                <KeyRound className="h-4 w-4 text-green-400" />
                <AlertDescription className="text-sm text-green-300">
                  Since Pokify doesn&apos;t have an email server configured, here&apos;s your one-time reset code — normally
                  this would be emailed to you: <span className="font-mono font-bold tracking-widest">{resetToken}</span>
                </AlertDescription>
              </Alert>
              <div className="space-y-2">
                <Label htmlFor="reset-code">Reset code</Label>
                <Input
                  id="reset-code"
                  value={resetCodeInput}
                  onChange={(e) => setResetCodeInput(e.target.value)}
                  placeholder="e.g. 4F9C21AB"
                  className="pokify-input pl-4 font-mono uppercase tracking-widest"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-password">New password</Label>
                <div className="relative">
                  <Lock className="pokify-input-icon" />
                  <Input
                    id="new-password"
                    type={showPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    className="pokify-input pr-10"
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-300"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              {error && (
                <Alert className="border-red-900/50 bg-red-950/50 py-2">
                  <AlertDescription className="text-sm text-red-300">{error}</AlertDescription>
                </Alert>
              )}
              <Button
                type="submit"
                disabled={loading}
                className="w-full rounded-full bg-green-500 py-6 font-semibold text-black hover:bg-green-400"
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Reset password
              </Button>
            </form>
          )}

          {mode === "forgot" && resetSuccess && (
            <div className="flex flex-col items-center gap-3 py-4 text-center">
              <CheckCircle className="h-10 w-10 text-green-500" />
              <p className="font-semibold text-white">Password reset!</p>
              <p className="text-sm text-neutral-400">You&apos;ve been logged out everywhere for security. Log in with your new password.</p>
              <Button
                onClick={() => switchMode("login")}
                className="mt-2 w-full rounded-full bg-green-500 py-6 font-semibold text-black hover:bg-green-400"
              >
                Back to log in
              </Button>
            </div>
          )}

          {mode !== "forgot" && (
            <p className="mt-5 text-center text-xs text-neutral-400">
              Your account, playlists, and liked songs are saved on the server so they follow you across browsers and devices.
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
