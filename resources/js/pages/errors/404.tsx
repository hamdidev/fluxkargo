import { Link } from '@inertiajs/react';

export default function NotFound() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-[#f8f9ff]">
            <div className="text-center">
                <p className="font-mono text-8xl font-extrabold text-indigo-600">
                    404
                </p>
                <h1 className="mt-4 text-2xl font-bold text-slate-900">
                    Page not found
                </h1>
                <p className="mt-2 text-sm text-slate-500">
                    The page you're looking for doesn't exist.
                </p>
                <Link
                    href="/"
                    className="mt-6 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-xs font-semibold text-white hover:bg-indigo-600"
                >
                    Go home
                </Link>
            </div>
        </div>
    );
}
