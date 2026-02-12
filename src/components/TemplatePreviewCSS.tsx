import React from 'react';

interface TemplatePreviewProps {
    template: {
        id: string;
        layout: 'single_column' | 'two_column_sidebar' | 'single_column_creative';
        color_scheme: {
            primary: string;
            secondary: string;
            accent: string;
        };
    };
}

export const TemplatePreviewCSS: React.FC<TemplatePreviewProps> = ({ template }) => {
    const { layout, color_scheme } = template;

    // French Modern Blue - Two Column Sidebar
    if (template.id === 'france-modern-blue-1') {
        return (
            <div className="w-full h-full bg-white rounded overflow-hidden shadow-inner">
                <div className="flex h-full">
                    {/* Sidebar */}
                    <div
                        className="w-[35%] p-3 flex flex-col gap-2"
                        style={{ backgroundColor: color_scheme.primary }}
                    >
                        {/* Photo circle */}
                        <div className="w-12 h-12 rounded-full bg-white/30 mx-auto mb-1"></div>

                        {/* Contact lines */}
                        <div className="space-y-1">
                            <div className="h-1 w-full bg-white/40 rounded"></div>
                            <div className="h-1 w-3/4 bg-white/40 rounded"></div>
                            <div className="h-1 w-full bg-white/40 rounded"></div>
                        </div>

                        {/* Sections */}
                        <div className="mt-2 space-y-1.5">
                            <div className="h-1.5 w-1/2 bg-white/60 rounded"></div>
                            <div className="h-1 w-full bg-white/30 rounded"></div>
                            <div className="h-1 w-4/5 bg-white/30 rounded"></div>
                        </div>

                        <div className="mt-2 space-y-1.5">
                            <div className="h-1.5 w-1/2 bg-white/60 rounded"></div>
                            <div className="h-1 w-full bg-white/30 rounded"></div>
                            <div className="h-1 w-3/4 bg-white/30 rounded"></div>
                        </div>
                    </div>

                    {/* Main content */}
                    <div className="flex-1 p-3 bg-white">
                        {/* Name */}
                        <div className="h-3 w-2/3 rounded mb-2" style={{ backgroundColor: color_scheme.primary }}></div>
                        <div className="h-1.5 w-1/3 bg-gray-300 rounded mb-3"></div>

                        {/* Content blocks */}
                        <div className="space-y-2">
                            <div className="h-1.5 w-1/4 rounded" style={{ backgroundColor: color_scheme.accent }}></div>
                            <div className="space-y-1">
                                <div className="h-1 w-full bg-gray-200 rounded"></div>
                                <div className="h-1 w-5/6 bg-gray-200 rounded"></div>
                                <div className="h-1 w-4/5 bg-gray-200 rounded"></div>
                            </div>
                        </div>

                        <div className="mt-2 space-y-2">
                            <div className="h-1.5 w-1/4 rounded" style={{ backgroundColor: color_scheme.accent }}></div>
                            <div className="space-y-0.5">
                                <div className="h-1 w-3/4 bg-gray-200 rounded"></div>
                                <div className="h-1 w-full bg-gray-200 rounded"></div>
                                <div className="h-1 w-2/3 bg-gray-200 rounded"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // French Commercial Elegant
    if (template.id === 'france-commercial-elegant') {
        return (
            <div className="w-full h-full bg-white rounded overflow-hidden shadow-inner p-3">
                {/* Header with accent bar */}
                <div className="h-2 w-full rounded mb-2" style={{ backgroundColor: color_scheme.primary }}></div>

                <div className="flex gap-2 mb-2">
                    {/* Photo */}
                    <div className="w-10 h-10 rounded bg-gray-300 flex-shrink-0"></div>

                    {/* Name & contact */}
                    <div className="flex-1">
                        <div className="h-2.5 w-3/4 rounded mb-1" style={{ backgroundColor: color_scheme.primary }}></div>
                        <div className="space-y-0.5">
                            <div className="h-0.5 w-full bg-gray-300 rounded"></div>
                            <div className="h-0.5 w-2/3 bg-gray-300 rounded"></div>
                        </div>
                    </div>
                </div>

                {/* Content sections */}
                <div className="space-y-1.5 mt-2">
                    <div className="h-1 w-1/4 rounded" style={{ backgroundColor: color_scheme.accent }}></div>
                    <div className="space-y-0.5">
                        <div className="h-0.5 w-full bg-gray-200 rounded"></div>
                        <div className="h-0.5 w-5/6 bg-gray-200 rounded"></div>
                        <div className="h-0.5 w-4/5 bg-gray-200 rounded"></div>
                    </div>
                </div>

                <div className="space-y-1.5 mt-2">
                    <div className="h-1 w-1/4 rounded" style={{ backgroundColor: color_scheme.accent }}></div>
                    <div className="space-y-0.5">
                        <div className="h-0.5 w-full bg-gray-200 rounded"></div>
                        <div className="h-0.5 w-4/5 bg-gray-200 rounded"></div>
                    </div>
                </div>
            </div>
        );
    }

    // French Simple Classic
    if (template.id === 'france-simple-classic') {
        return (
            <div className="w-full h-full bg-white rounded overflow-hidden shadow-inner p-3">
                {/* Header */}
                <div className="flex gap-2 mb-2 pb-1 border-b-2" style={{ borderColor: color_scheme.primary }}>
                    <div className="w-8 h-8 rounded bg-gray-300 flex-shrink-0"></div>
                    <div className="flex-1">
                        <div className="h-2 w-2/3 rounded mb-0.5" style={{ backgroundColor: color_scheme.primary }}></div>
                        <div className="h-0.5 w-1/2 bg-gray-400 rounded"></div>
                    </div>
                </div>

                {/* Contact info row */}
                <div className="flex gap-1 mb-2">
                    <div className="h-0.5 w-1/4 bg-gray-300 rounded"></div>
                    <div className="h-0.5 w-1/4 bg-gray-300 rounded"></div>
                    <div className="h-0.5 w-1/4 bg-gray-300 rounded"></div>
                </div>

                {/* Sections */}
                <div className="space-y-1.5">
                    <div className="h-1 w-1/5 rounded" style={{ backgroundColor: color_scheme.primary }}></div>
                    <div className="space-y-0.5 pl-1">
                        <div className="h-0.5 w-full bg-gray-200 rounded"></div>
                        <div className="h-0.5 w-5/6 bg-gray-200 rounded"></div>
                        <div className="h-0.5 w-4/5 bg-gray-200 rounded"></div>
                    </div>
                </div>

                <div className="space-y-1.5 mt-2">
                    <div className="h-1 w-1/5 rounded" style={{ backgroundColor: color_scheme.primary }}></div>
                    <div className="space-y-0.5 pl-1">
                        <div className="h-0.5 w-full bg-gray-200 rounded"></div>
                        <div className="h-0.5 w-4/5 bg-gray-200 rounded"></div>
                    </div>
                </div>
            </div>
        );
    }

    // French Creative Diagonal
    if (template.id === 'france-creative-diagonal') {
        return (
            <div className="w-full h-full bg-white rounded overflow-hidden shadow-inner relative">
                {/* Diagonal stripe */}
                <div
                    className="absolute top-0 left-0 right-0 h-16 transform -rotate-3 origin-top-left"
                    style={{
                        background: `linear-gradient(135deg, ${color_scheme.primary}, ${color_scheme.accent})`,
                        transform: 'skewY(-3deg) translateY(-8px)'
                    }}
                ></div>

                {/* Photo integrated with diagonal */}
                <div className="absolute top-6 left-3 w-10 h-10 rounded-full bg-white/90 border-2 border-white shadow-lg"></div>

                {/* Content */}
                <div className="relative pt-12 px-3">
                    <div className="h-2.5 w-2/3 rounded mb-1" style={{ backgroundColor: color_scheme.primary }}></div>
                    <div className="h-1 w-1/3 bg-gray-400 rounded mb-2"></div>

                    <div className="grid grid-cols-3 gap-1 mb-2">
                        <div className="h-0.5 bg-gray-300 rounded"></div>
                        <div className="h-0.5 bg-gray-300 rounded"></div>
                        <div className="h-0.5 bg-gray-300 rounded"></div>
                    </div>

                    {/* Content sections */}
                    <div className="space-y-1.5 mt-2">
                        <div className="h-1 w-1/4 rounded" style={{ backgroundColor: color_scheme.accent }}></div>
                        <div className="space-y-0.5">
                            <div className="h-0.5 w-full bg-gray-200 rounded"></div>
                            <div className="h-0.5 w-5/6 bg-gray-200 rounded"></div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Default fallback
    return (
        <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center rounded">
            <div className="text-center p-4">
                <div className="h-12 w-12 rounded-full mx-auto mb-2"
                    style={{ backgroundColor: color_scheme.primary, opacity: 0.3 }}></div>
                <div className="space-y-1">
                    <div className="h-1 w-16 bg-gray-400 rounded mx-auto"></div>
                    <div className="h-1 w-20 bg-gray-400 rounded mx-auto"></div>
                    <div className="h-1 w-12 bg-gray-400 rounded mx-auto"></div>
                </div>
            </div>
        </div>
    );
};
