<script setup>
import { onMounted, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
const props = defineProps({
    currentStep: {
        type: String,
        required: true
    }
});

const steps = ref([
    { name: 'Review Order', completed: false, active: false },
    { name: 'Payment', completed: false, active: false },
    { name: 'Schedule', completed: false, active: false },
    { name: 'Confirmation', completed: false, active: false }
]);


const translatedSteps = computed(() => {
  return steps.value.map(step => ({
    ...step,
    name: t(step.name)
    }));
});

const updateSteps = () => {
    const currentIndex = steps.value.findIndex(step => step.name === props.currentStep);

    if (currentIndex === -1) return;

    steps.value = steps.value.map((step, index) => ({
        ...step,
        // Only mark steps before the current one as completed
        completed: index < currentIndex,
        active: index === currentIndex // Only the current step is active
    }));
};

const getProgressWidth = () => {
    switch (props.currentStep) {
        case 'Review Order':
            return '12%';
        case 'Payment':
            return '35%';
        case 'Schedule':
            return '64%';
        case 'Confirmation':
            return '100%';
        default:
            return '0%';
    }
};

onMounted(() => {
    updateSteps();
});

watch(() => props.currentStep, (newVal) => {
    console.log("Current step changed to:", newVal);
    updateSteps();
});
</script>

<template>
    <div class="progress-container">
        <div class="progress-bar">
            <div class="progress-bar-fill" :style="{ width: getProgressWidth() }"></div>

            <div v-for="(step, index) in translatedSteps" :key="index" :class="['progress-step',
                { 'step-completed': step.completed },
                { 'step-current': step.active }]">
                <div class="step-icon">
                    <!-- Show checkmark for completed steps OR when it's the confirmation step and it's current -->
                    <template v-if="step.completed || (step.active && step.name === 'Confirmation')">✓</template>
                    <template v-else>{{ index + 1 }}</template>
                </div>
                <div class="step-text">{{ step.name }}</div>
            </div>
        </div>
    </div>
</template>

<style scoped>
/* Progress Bar */
.progress-container {
    margin-bottom: 50px;
    padding-top: 30px;
}

.progress-bar {
    display: flex;
    justify-content: space-between;
    position: relative;
    max-width: 800px;
    margin: 0 auto;
}

.progress-bar::before {
    content: '';
    position: absolute;
    top: 20px;
    left: 0;
    height: 3px;
    width: 100%;
    background-color: var(--gray-300, #e2e8f0);
    z-index: 1;
}

.progress-bar-fill {
    position: absolute;
    top: 20px;
    left: 0;
    height: 3px;
    background-color: var(--primary-color, #49a38c);
    z-index: 2;
    transition: width 0.3s ease;
}

.progress-step {
    position: relative;
    z-index: 3;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 25%;
}

.step-icon {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background-color: white;
    border: 2px solid var(--gray-300, #e2e8f0);
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 10px;
    font-weight: 600;
    font-size: 16px;
    transition: all 0.3s ease;
}

.step-text {
    text-align: center;
    font-size: 14px;
    color: var(--gray-600, #718096);
    font-weight: 500;
    transition: color 0.3s ease;
}

/* Completed step styling */
.step-completed .step-icon {
    background-color: var(--primary-color, #49a38c);
    border-color: var(--primary-color, #49a38c);
    color: white;
    box-shadow: 0 2px 8px rgba(73, 163, 140, 0.3);
}

/* Current step styling - green border, no background change */
.step-current .step-icon {
    background-color: white;
    /* Ensure background is white */
    border-color: var(--primary-color, #49a38c);
    border-width: 2px;
    color: var(--gray-700, #4a5568);
    /* Keep text dark for better visibility */
    box-shadow: 0 2px 8px rgba(73, 163, 140, 0.2);
}

/* Special styling for confirmation step when it's current */
.step-current[class*="progress-step"]:last-child .step-icon {
    background-color: var(--primary-color, #49a38c);
    border-color: var(--primary-color, #49a38c);
    color: white;
}

.step-completed .step-text,
.step-current .step-text {
    color: var(--gray-800, #2d3748);
    font-weight: 600;
}

@media (max-width: 900px) {
    .step-text {
        font-size: 12px;
    }
}
</style>
