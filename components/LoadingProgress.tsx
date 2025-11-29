import React, { useEffect, useState } from 'react';
interface LoadingProgressProps {
    isLoading: boolean;
}
const LoadingProgress: React.FC<LoadingProgressProps> = ({ isLoading }) => {
    const [progress, setProgress] = useState(0);
    const [stage, setStage] = useState('Initializing...');
    useEffect(() => {
        if (!isLoading) {
            setProgress(0);
            setStage('Initializing...');
            return;
        }
        // Simulated stages with progress
        const stages = [
            { text: 'Fetching market data sources...', duration: 2000, endProgress: 20 },
            { text: 'Analyzing property data...', duration: 3000, endProgress: 50 },
            { text: 'Calculating valuations...', duration: 2500, endProgress: 75 },
            { text: 'Generating insights...', duration: 2000, endProgress: 95 },
            { text: 'Finalizing report...', duration: 500, endProgress: 100 }
        ];
        let currentStageIndex = 0;
        let currentProgress = 0;
        const updateProgress = () => {
            if (currentStageIndex >= stages.length) {
                return;
            }
            const currentStage = stages[currentStageIndex];
            setStage(currentStage.text);
            const progressIncrement = (currentStage.endProgress - currentProgress) / 20;
            const interval = currentStage.duration / 20;
            const progressInterval = setInterval(() => {
                currentProgress += progressIncrement;
                setProgress(Math.min(currentProgress, currentStage.endProgress));
                if (currentProgress >= currentStage.endProgress) {
                    clearInterval(progressInterval);
                    currentStageIndex++;
                    if (currentStageIndex < stages.length) {
                        setTimeout(updateProgress, 100);
                    }
                }
            }, interval);
        };
        updateProgress();
        // Cleanup
        return () => {
            setProgress(0);
            setStage('Initializing...');
        };
    }, [isLoading]);
    if (!isLoading) return null;
    return (
        <div className="h-96 flex flex-col items-center justify-center bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            {/* Animated Icon */}
            <div className="relative mb-6">
                <div className="w-20 h-20 border-4 border-blue-100 rounded-full"></div>
                <div className="absolute top-0 left-0 w-20 h-20 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                    <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                    </svg>
                </div>
            </div>
            {/* Progress Bar */}
            <div className="w-full max-w-md mb-4">
                <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">{stage}</span>
                    <span className="text-sm font-bold text-blue-600">{Math.round(progress)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div 
                        className="bg-gradient-to-r from-blue-500 to-indigo-600 h-full rounded-full transition-all duration-300 ease-out"
                        style={{ width: `${progress}%` }}>
                    </div>
                </div>
            </div>
            {/* Status Text */}
            <p className="text-xs text-gray-500 text-center max-w-sm">
                Analyzing market trends and property data for your location...
            </p>
        </div>
    );
};
export default LoadingProgress;
