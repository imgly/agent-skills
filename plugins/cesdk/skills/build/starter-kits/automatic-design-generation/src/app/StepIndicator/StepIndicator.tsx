import styles from './StepIndicator.module.css';

interface Step {
  number: number;
  label: string;
}

const STEPS: Step[] = [
  { number: 1, label: 'Select' },
  { number: 2, label: 'Customize' },
  { number: 3, label: 'Generate' }
];

interface StepIndicatorProps {
  currentStep: number;
  totalSteps?: number;
  onStepClick: (step: number) => void;
  onBack: () => void;
  onNext: () => void;
  canGoNext?: boolean;
}

export function StepIndicator({
  currentStep,
  onStepClick,
  onBack,
  onNext,
  canGoNext = true
}: StepIndicatorProps) {
  const isFirstStep = currentStep === 1;
  const isLastStep = currentStep === STEPS.length;

  return (
    <div className={styles.bar}>
      <button
        className={styles.navButton}
        onClick={onBack}
        disabled={isFirstStep}
      >
        <svg
          className={styles.navIcon}
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M14.2071 6.2929C13.8166 5.90237 13.1834 5.90237 12.7929 6.29289L7.7929 11.2928C7.60536 11.4803 7.5 11.7347 7.5 11.9999C7.5 12.2651 7.60535 12.5195 7.79289 12.707L12.7929 17.7071C13.1834 18.0976 13.8166 18.0976 14.2071 17.7071C14.5976 17.3166 14.5976 16.6834 14.2071 16.2929L9.91421 11.9999L14.2071 7.70711C14.5976 7.31659 14.5976 6.68343 14.2071 6.2929Z"
            fill="currentColor"
          />
        </svg>
        Back
      </button>

      <div className={styles.steps}>
        {STEPS.map(({ number, label }) => {
          const isActive = number === currentStep;
          const isCompleted = number < currentStep;
          const isClickable = number <= currentStep;

          return (
            <button
              key={number}
              className={styles.step}
              onClick={() => onStepClick(number)}
              disabled={!isClickable}
            >
              <span
                className={`${styles.number} ${
                  isActive
                    ? styles.numberActive
                    : isCompleted
                      ? styles.numberCompleted
                      : styles.numberInactive
                }`}
              >
                {number}
              </span>
              <span
                className={`${styles.label} ${
                  isActive
                    ? styles.labelActive
                    : isCompleted
                      ? styles.labelCompleted
                      : styles.labelInactive
                }`}
              >
                {label}
              </span>
            </button>
          );
        })}
      </div>

      <button
        className={`${styles.navButton} ${styles.navButtonNext}`}
        onClick={onNext}
        disabled={isLastStep || !canGoNext}
      >
        Next
        <svg
          className={styles.navIcon}
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M9.79289 6.29289C10.1834 5.90237 10.8166 5.90237 11.2071 6.29289L16.2071 11.2929C16.5976 11.6834 16.5976 12.3166 16.2071 12.7071L11.2071 17.7071C10.8166 18.0976 10.1834 18.0976 9.79289 17.7071C9.40237 17.3166 9.40237 16.6834 9.79289 16.2929L14.0858 12L9.79289 7.70711C9.40237 7.31658 9.40237 6.68342 9.79289 6.29289Z"
            fill="currentColor"
          />
        </svg>
      </button>
    </div>
  );
}
