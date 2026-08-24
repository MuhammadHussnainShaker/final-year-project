"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [saveMsg, setSaveMsg] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
    if (session?.user) {
      setName(session.user.name || "");
      setEmail(session.user.email || "");
    }
  }, [session, status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="animate-pulse text-gray-400">Loading...</div>
      </div>
    );
  }

  if (!session) return null;

  function handleSave() {
    // Prototype placeholder — no backend update
    setSaveMsg("Profile updated (prototype only)");
    setTimeout(() => setSaveMsg(""), 3000);
  }

  return (
    <div className="min-h-[80vh] bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-2">
            <div className="w-16 h-16 rounded-full bg-blue-600 text-white flex items-center justify-center text-2xl font-bold">
              {session.user?.name?.charAt(0).toUpperCase() || "U"}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Welcome, {session.user?.name || "User"}!
              </h1>
              <p className="text-gray-500">{session.user?.email}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* My RSVPs */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">My RSVPs</CardTitle>
              <CardDescription>Events you&apos;re attending</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-400">
                <p className="text-sm">No RSVPs yet</p>
                <p className="text-xs mt-1">RSVP to events to see them here</p>
              </div>
            </CardContent>
          </Card>

          {/* Saved Events */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Saved Events</CardTitle>
              <CardDescription>Events you bookmarked</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-400">
                <p className="text-sm">No saved events</p>
                <p className="text-xs mt-1">Save events to see them here</p>
              </div>
            </CardContent>
          </Card>

          {/* Submitted Events */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Submitted Events</CardTitle>
              <CardDescription>Events you submitted for review</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-400">
                <p className="text-sm">No submitted events</p>
                <p className="text-xs mt-1">Submit an event to see it here</p>
              </div>
            </CardContent>
          </Card>

          {/* Profile Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Profile Settings</CardTitle>
              <CardDescription>Update your account info</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="dash-name">Name</Label>
                <Input
                  id="dash-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dash-email">Email</Label>
                <Input
                  id="dash-email"
                  value={email}
                  disabled
                />
              </div>
              <Button variant="outline" onClick={handleSave}>
                Save Changes
              </Button>
              {saveMsg && (
                <p className="text-sm text-green-600">{saveMsg}</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Logout */}
        <div className="mt-8 text-center">
          <Button
            variant="destructive"
            onClick={() => signOut({ callbackUrl: "/" })}
          >
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
}
