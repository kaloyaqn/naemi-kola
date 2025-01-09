"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Description, Dialog, DialogPanel, DialogTitle } from '@headlessui/react'
import Login from "../Login";


export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const supabase = createClient();

  const navigationItems = [
    { title: "Начало", href: "/" },
  ];

  useEffect(() => {
    async function fetchSessionAndProfile() {
      // Fetch session
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);

      // Fetch profile if session exists
      if (session) {
        const { data: profileData, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (profileData) {
          setProfile(profileData);
        }
      }
    }

    fetchSessionAndProfile();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
      }
    );

    // Cleanup subscription
    return () => {
      subscription.unsubscribe();
    }
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  }

  // Conditionally add admin navigation item
  const fullNavigationItems = [
    ...navigationItems,
    ...(profile?.role === 'admin' ? [{ title: "Админ", href: "/admin" }] : [])
  ];

  return (
    <header className="w-full z-40 top-0 left-0 bg-white border-b border-[#E8EEF5]">
      <div className="container relative mx-auto min-h-20 flex gap-4 flex-row lg:grid lg:grid-cols-3 items-center">
        {/* Desktop Navigation */}
        <div className="justify-start items-center gap-4 lg:flex hidden flex-row">
          <div className="flex justify-start gap-4 flex-row">
            {fullNavigationItems.map((item) => (
              <div key={item.title}>
                <Link href={item.href}>
                  <Button variant="ghost">{item.title}</Button>
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Logo */}
        <div className="flex lg:justify-center">
          <Link href="/">
            <p className="font-semibold">Naemi-kola</p>
          </Link>
        </div>

        {/* User Actions */}
        <div className="flex justify-end w-full gap-4">
          <div className="border-r hidden md:inline"></div>
          <div className="flex items-center gap-4">
            {session ? (
              <div className="flex items-center gap-2">
                <Link href="/account">
                  <Button variant="ghost">Профил</Button>
                </Link>
                <Button variant="secondary" onClick={handleLogout}>
                  Logout
                </Button>
              </div>
            ) : (
              <div onClick={() => setIsOpen(true)}>
                <Button variant="primary">Вход</Button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        <div className="flex w-12 shrink lg:hidden items-end justify-end">
          <Button variant="ghost" onClick={() => setOpen(!isOpen)}>
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
          {isOpen && (
            <div className="absolute top-20 border-t flex flex-col w-full right-0 bg-background shadow-lg py-4 container gap-8">
              {fullNavigationItems.map((item) => (
                <div key={item.title}>
                  <div className="flex flex-col gap-2">
                    <Link href={item.href} className="text-lg">
                      {item.title}
                    </Link>
                  </div>
                </div>
              ))}
              {session ? (
                <div className="flex flex-col gap-2">
                  <Link href="/account" className="text-lg">
                    Профил
                  </Link>
                  <Button 
                    variant="secondary" 
                    onClick={handleLogout}
                    className="self-start"
                  >
                    Logout
                  </Button>
                </div>
              ) : (
                <button onClick={() => setIsOpen(true)} className="text-lg">
                  Вход
                </button>
                
              )}
            </div>
          )}
        </div>
      </div>
      <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-50">
  <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
    <DialogPanel className="max-w-lg space-y-4 border bg-white p-12">
      <Login open={isOpen} setIsOpen={setIsOpen}/>
    </DialogPanel>
  </div>
</Dialog>
    </header>
  );
}
