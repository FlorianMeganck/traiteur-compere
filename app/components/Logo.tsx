export default function Logo({ className = "h-12 w-auto" }: { className?: string }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 100 100"
            className={className}
            fill="none"
        >
            {/* Circle/Background hint */}
            {/* <circle cx="50" cy="50" r="48" stroke="#D4AF37" strokeWidth="1" opacity="0.2" /> */}

            {/* Stylized T */}
            <path
                d="M25 35 H 75 M 50 35 V 85"
                stroke="#D4AF37"
                strokeWidth="4"
                strokeLinecap="round"
                className="drop-shadow-md"
            />

            {/* Stylized C - intertwined */}
            <path
                d="M65 35 C 40 35, 30 50, 30 65 C 30 80, 45 85, 65 85"
                stroke="white"
                strokeWidth="4"
                strokeLinecap="round"
                fill="none"
                className="drop-shadow-sm opacity-90"
            />

            {/* Minimalist Leaf Icon */}
            <path
                d="M60 20 Q 75 10, 80 25 Q 70 35, 60 20 Z"
                fill="#D4AF37"
            />
        </svg>
    );
}
