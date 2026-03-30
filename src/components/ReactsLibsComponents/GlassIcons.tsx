import React from 'react';

export interface GlassIconsItem {
    icon: React.ReactElement;
    color: string;
    label: string;
    customClass?: string;
}

export interface GlassIconsProps {
    items: GlassIconsItem[];
    className?: string;
    isMini?: boolean;
}

const gradientMapping: Record<string, string> = {
    blue: 'linear-gradient(hsl(223, 90%, 50%), hsl(208, 90%, 50%))',
    purple: 'linear-gradient(hsl(283, 90%, 50%), hsl(268, 90%, 50%))',
    red: 'linear-gradient(hsl(3, 90%, 50%), hsl(348, 90%, 50%))',
    indigo: 'linear-gradient(hsl(253, 90%, 50%), hsl(238, 90%, 50%))',
    orange: 'linear-gradient(hsl(43, 90%, 50%), hsl(28, 90%, 50%))',
    green: 'linear-gradient(hsl(123, 90%, 40%), hsl(108, 90%, 40%))',
    violet: 'linear-gradient(to bottom right, #9333ea, #7c3aed)'
};

const GlassIcons: React.FC<GlassIconsProps> = ({ items, className, isMini = false }) => {
    const getBackgroundStyle = (color: string): React.CSSProperties => {
        if (gradientMapping[color]) {
            return { background: gradientMapping[color] };
        }
        return { background: color };
    };

    return (
        <div className={`flex flex-wrap gap-4 overflow-visible ${!isMini ? 'grid grid-cols-2 md:grid-cols-3 py-[3em]' : ''} ${className || ''}`}>
            {items.map((item, index) => (
                <button
                    key={index}
                    type="button"
                    aria-label={item.label}
                    className={`relative bg-transparent outline-none border-none cursor-pointer [perspective:24em] [transform-style:preserve-3d] group ${isMini ? 'w-[1.8em] h-[1.8em]' : 'w-[4.5em] h-[4.5em]'
                        } ${item.customClass || ''}`}
                >

                    <span
                        className={`absolute top-0 left-0 w-full h-full block transition-all duration-300 ease-[cubic-bezier(0.83,0,0.17,1)] origin-center rotate-0 group-hover:[transform:translate3d(-0.1em,-0.1em,0.1em)] ${isMini ? 'rounded-[0.5em]' : 'rounded-[1.25em]'
                            }`}
                        style={{
                            ...getBackgroundStyle(item.color),
                            boxShadow: isMini ? 'none' : '0 0.2em 0.5em rgba(0,0,0,0.1)'
                        }}
                    ></span>


                    <span
                        className={`absolute top-0 left-0 w-full h-full bg-white/20 transition-all duration-300 ease-[cubic-bezier(0.83,0,0.17,1)] flex backdrop-blur-[4px] border border-white/40 group-hover:[transform:translate3d(0.1em,0.1em,0.5em)] ${isMini ? 'rounded-[0.5em]' : 'rounded-[1.25em]'
                            }`}
                        style={{
                            boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.2)'
                        }}
                    >
                        <span className={`m-auto flex items-center justify-center ${isMini ? 'scale-75' : ''}`} aria-hidden="true">
                            {item.icon}
                        </span>
                    </span>

                    {!isMini && (
                        <span className="absolute top-full left-0 right-0 text-center whitespace-nowrap leading-[2] text-xs opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-1">
                            {item.label}
                        </span>
                    )}
                </button>
            ))}
        </div>
    );
};

export default GlassIcons;