import { useState, useEffect } from 'react';

const Countdown = ({ deadline }) => {
    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

    function calculateTimeLeft() {
        const difference = +new Date(deadline) - +new Date();
        let timeLeft = {};

        if (difference > 0) {
            timeLeft = {
                d: Math.floor(difference / (1000 * 60 * 60 * 24)),
                h: Math.floor((difference / (1000 * 60 * 60)) % 24),
                m: Math.floor((difference / 1000 / 60) % 60),
                s: Math.floor((difference / 1000) % 60),
            };
        }
        return timeLeft;
    }

    useEffect(() => {
        const timer = setTimeout(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);
        return () => clearTimeout(timer);
    });

    const timerComponents = Object.keys(timeLeft).map((interval) => {
        if (!timeLeft[interval] && timeLeft[interval] !== 0) return null;
        return (
            <span key={interval} className="bg-indigo-50 text-indigo-700 px-2 py-1 rounded-md text-[10px] font-bold mx-0.5">
                {timeLeft[interval]}{interval}
            </span>
        );
    });

    return (
        <div className="flex items-center">
            {timerComponents.length ? timerComponents : <span className="text-red-500 font-bold text-[10px]">ENDED</span>}
        </div>
    );
};

export default Countdown;