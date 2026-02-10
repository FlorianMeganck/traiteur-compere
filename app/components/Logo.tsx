export default function Logo({ className = "h-12 w-auto" }: { className?: string }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 100 100"
            className={className}
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
        >
            {/* Circle Border */}
            <circle cx="50" cy="50" r="45" />

            {/* T */}
            <path
                d="M30 35 H 55 M 42.5 35 V 70"
                strokeLinecap="round"
            />

            {/* C */}
            <path
                d="M75 45 C 75 35, 68 35, 60 35 C 52 35, 50 50, 50 52.5 C 50 65, 55 70, 65 70 C 72 70, 75 62, 75 62"
                strokeLinecap="round"
            />
        </svg>
    );
}
