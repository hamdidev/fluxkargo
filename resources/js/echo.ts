import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

let echo: Echo<'reverb'>;

if (typeof window !== 'undefined') {
    window.Pusher = Pusher;

    echo = new Echo({
        broadcaster: 'reverb',
        key: import.meta.env.VITE_REVERB_APP_KEY,
        wsHost: import.meta.env.VITE_REVERB_HOST,
        wsPort: Number(import.meta.env.VITE_REVERB_PORT),
        wssPort: Number(import.meta.env.VITE_REVERB_PORT),
        forceTLS: false,
        enabledTransports: ['ws'],
    });
}

export default echo!;
