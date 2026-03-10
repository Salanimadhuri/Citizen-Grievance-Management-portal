import { useState, Children, cloneElement } from 'react';

export const Step = ({ children }) => {
  return <div>{children}</div>;
};

const Stepper = ({
  children,
  initialStep = 1,
  onStepChange,
  onFinalStepCompleted,
  backButtonText = "Previous",
  nextButtonText = "Next"
}) => {
  const [currentStep, setCurrentStep] = useState(initialStep);
  const steps = Children.toArray(children);
  const totalSteps = steps.length;

  const handleNext = () => {
    if (currentStep < totalSteps) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      onStepChange?.(nextStep);
      
      if (nextStep === totalSteps) {
        onFinalStepCompleted?.();
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      const prevStep = currentStep - 1;
      setCurrentStep(prevStep);
      onStepChange?.(prevStep);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          {Array.from({ length: totalSteps }, (_, index) => (
            <div
              key={index}
              className={`flex items-center justify-center w-10 h-10 rounded-full font-semibold ${
                index + 1 <= currentStep
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-200 text-gray-600'
              }`}
            >
              {index + 1}
            </div>
          ))}
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-primary-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          />
        </div>
      </div>

      {/* Step Content */}
      <div className="bg-white rounded-lg p-8 shadow-lg min-h-[200px]">
        {steps[currentStep - 1]}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-6">
        <button
          onClick={handlePrevious}
          disabled={currentStep === 1}
          className={`px-6 py-2 rounded-lg font-medium ${
            currentStep === 1
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
          }`}
        >
          {backButtonText}
        </button>
        
        <span className="text-gray-600 self-center">
          Step {currentStep} of {totalSteps}
        </span>
        
        <button
          onClick={handleNext}
          disabled={currentStep === totalSteps}
          className={`px-6 py-2 rounded-lg font-medium ${
            currentStep === totalSteps
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'btn-primary'
          }`}
        >
          {nextButtonText}
        </button>
      </div>
    </div>
  );
};

export default Stepper;