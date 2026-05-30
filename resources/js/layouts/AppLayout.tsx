import React from 'react';
import { usePage } from '@inertiajs/react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { useEffect } from 'react';
import { toast } from 'sonner';

interface Props {
    children: React.ReactNode;
}

export default function AppLayout({ children }: Props) {
    const { flash } = usePage<{ flash: { success?: string; error?: string } }>()
        .props;
    useEffect(() => {
        if (flash?.success) toast.success(flash.success);
        if (flash?.error) toast.error(flash.error);
    }, [flash]);
    const { auth } = usePage<{
        auth: {
            user: {
                id: number;
                name: string;
                email: string;
                role: string;
                company?: { name: string };
            };
        };
    }>().props;

    const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
    const [searchFilter, setSearchFilter] = React.useState('');

    return (
        <div className="min-h-screen bg-[#f8f9ff]" id="app-layout-root">
            <Sidebar
                role={auth.user.role}
                isMobileMenuOpen={isMobileMenuOpen}
                setIsMobileMenuOpen={setIsMobileMenuOpen}
                currentUser={{
                    name: auth.user.name,
                    email: auth.user.email,
                    companyName: auth.user.company?.name,
                }}
            />
            <div className="flex min-h-screen flex-col md:pl-[280px]">
                <Header
                    onSearchChange={setSearchFilter}
                    setIsMobileMenuOpen={setIsMobileMenuOpen}
                />
                <main className="mx-auto w-full max-w-7xl flex-1 p-4 md:p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}
