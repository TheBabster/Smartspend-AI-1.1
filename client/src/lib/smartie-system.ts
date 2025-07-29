// Smartie Animation System - Event-driven reactive companion
export interface SmartieEvent {
  type: 'expense-entry' | 'purchase-decision' | 'streak-update' | 'overspending' | 'goal-achieved';
  data?: any;
  timestamp: number;
}

export interface SmartieReaction {
  message: string;
  pose: 'happy' | 'thinking' | 'concerned' | 'celebrating' | 'nervous';
  duration: number;
  type: 'coaching' | 'praise' | 'warning' | 'celebration';
}

// Dialogue system with randomized variants
export const smartieDialogue = {
  expenseEntry: [
    "Got it logged! 📝",
    "Tracking that! 👀", 
    "Added to your books! 📊",
    "Noted and recorded! 📋"
  ],
  purchaseDecision: [
    "Smart thinking! 🧠",
    "Wise choice! 💭",
    "Good decision! ✅", 
    "You've got this! 💪"
  ],
  overspending: [
    "Oof! Time to cut back... 😅",
    "Let's slow down spending! 🛑",
    "Budget alert! 🚨",
    "Rein it in, champ! 💡"
  ],
  goodProgress: [
    "You're crushing it! 💎",
    "Perfect balance! ⚖️",
    "Smart choices! 🎯",
    "Nice control! 👏"
  ],
  streakAchieved: [
    "Legendary saver! 🌟",
    "You're on fire! 🔥",
    "Streak master! 💪", 
    "Amazing progress! ✨"
  ]
};

// Generate contextual Smartie reactions
export const generateSmartieReaction = (event: SmartieEvent): SmartieReaction => {
  const { type, data } = event;
  
  switch (type) {
    case 'expense-entry':
      return {
        message: getRandomDialogue('expenseEntry'),
        pose: 'happy',
        duration: 2000,
        type: 'praise'
      };
      
    case 'purchase-decision':
      return {
        message: getRandomDialogue('purchaseDecision'),
        pose: 'thinking',
        duration: 3000,
        type: 'coaching'
      };
      
    case 'streak-update':
      return {
        message: getRandomDialogue('streakAchieved'),
        pose: 'celebrating',
        duration: 4000,
        type: 'celebration'
      };
      
    case 'overspending':
      return {
        message: getRandomDialogue('overspending'),
        pose: 'concerned',
        duration: 5000,
        type: 'warning'
      };
      
    case 'goal-achieved':
      return {
        message: getRandomDialogue('streakAchieved'),
        pose: 'celebrating',
        duration: 4000,
        type: 'celebration'
      };
      
    default:
      return {
        message: getRandomDialogue('goodProgress'),
        pose: 'happy',
        duration: 3000,
        type: 'praise'
      };
  }
};

// Get random dialogue variant
export const getRandomDialogue = (category: keyof typeof smartieDialogue): string => {
  const options = smartieDialogue[category];
  return options[Math.floor(Math.random() * options.length)];
};

// Smartie event queue for performance
export class SmartieEventQueue {
  private queue: SmartieEvent[] = [];
  private processing = false;

  addEvent(event: SmartieEvent) {
    this.queue.push(event);
    if (!this.processing) {
      this.processQueue();
    }
  }

  private async processQueue() {
    this.processing = true;
    
    while (this.queue.length > 0) {
      const event = this.queue.shift()!;
      const reaction = generateSmartieReaction(event);
      
      // Emit reaction to listeners
      this.emitReaction(reaction);
      
      // Wait for reaction duration before processing next
      await new Promise(resolve => setTimeout(resolve, reaction.duration + 500));
    }
    
    this.processing = false;
  }

  private emitReaction(reaction: SmartieReaction) {
    // Custom event for cross-component communication
    window.dispatchEvent(new CustomEvent('smartie-reaction', { 
      detail: reaction 
    }));
  }
}

export const smartieEventQueue = new SmartieEventQueue();