'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Calendar,
  Bookmark,
  Send,
  Settings,
  ArrowRight,
  LogOut,
  Loader2,
} from 'lucide-react';
import { signOut } from 'next-auth/react';

function PlaceholderSection({
  icon,
  title,
  description,
  actionLabel,
  actionHref,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          {icon}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-500 text-sm mb-4">{description}</p>
        {actionLabel && actionHref && (
          <Link
            href={actionHref}
            className={buttonVariants({ variant: 'outline', size: 'sm' })}
          >
            {actionLabel}
            <ArrowRight className="h-3.5 w-3.5 ml-1" />
          </Link>
        )}
      </CardContent>
    </Card>
  );
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="h-8 w-8 text-indigo-600 animate-spin" />
      </div>
    );
  }

  if (!session) return null;

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-gray-500">Manage your profile and activity</p>
      </div>

      {/* Profile Card */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 text-2xl font-bold">
              {session.user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{session.user?.name || 'User'}</h2>
              <p className="text-gray-500">{session.user?.email || ''}</p>
              <Badge className="mt-1 bg-indigo-100 text-indigo-700 border-0">Registered User</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Dashboard Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* My RSVPs */}
        <PlaceholderSection
          icon={<Calendar className="h-5 w-5 text-indigo-600" />}
          title="My RSVPs"
          description="You haven't RSVP'd for any events yet. Browse events and register to see them here."
          actionLabel="Browse Events"
          actionHref="/events"
        />

        {/* Saved Events */}
        <PlaceholderSection
          icon={<Bookmark className="h-5 w-5 text-indigo-600" />}
          title="Saved Events"
          description="No saved events yet. Save events you're interested in to view them later."
          actionLabel="Browse Events"
          actionHref="/events"
        />

        {/* Submitted Events */}
        <PlaceholderSection
          icon={<Send className="h-5 w-5 text-indigo-600" />}
          title="Submitted Events"
          description="You haven't submitted any events yet. Submit an event for admin review."
          actionLabel="Submit Event"
          actionHref="/events"
        />
      </div>

      {/* Profile Settings */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Settings className="h-5 w-5 text-indigo-600" />
            Profile Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" defaultValue={session.user?.name || ''} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" defaultValue={session.user?.email || ''} disabled />
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="text-sm font-medium text-gray-900 mb-3">Change Password</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input id="currentPassword" type="password" placeholder="••••••••" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input id="newPassword" type="password" placeholder="••••••••" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmNewPassword">Confirm New Password</Label>
                <Input id="confirmNewPassword" type="password" placeholder="••••••••" />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <Button className="bg-indigo-600 hover:bg-indigo-700">Save Changes</Button>
          </div>
        </CardContent>
      </Card>

      {/* Logout */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-gray-900">Logout</h3>
              <p className="text-sm text-gray-500">Sign out of your account</p>
            </div>
            <Button
              variant="destructive"
              onClick={() => signOut({ callbackUrl: '/' })}
              className="flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
