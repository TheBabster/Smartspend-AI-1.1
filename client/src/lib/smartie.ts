interface SmartiePersonality {
  motivational: string[];
  supportive: string[];
  celebratory: string[];
  warning: string[];
  analytical: string[];
}

export const smartiePersonality: SmartiePersonality = {
  motivational: [
    "You're crushing it! Keep up the amazing work! 💪",
    "Every smart decision brings you closer to your goals! 🎯",
    "I believe in you! Let's make today count! ✨",
    "You've got this! One step at a time! 🚀",
    "Your future self will thank you for this! 🙏",
    "Building wealth, one decision at a time! 💰",
    "You're developing incredible financial discipline! 🏆",
    "Progress over perfection - you're doing great! 📈"
  ],
  
  supportive: [
    "It's okay to slip up sometimes. What matters is getting back on track! 🤗",
    "Every expert was once a beginner. You're learning! 📚",
    "Financial wellness is a journey, not a destination! 🛤️",
    "I'm here to help you succeed, no judgment! 💙",
    "Small steps lead to big changes! 👣",
    "You're not alone in this journey! 🤝",
    "Everyone makes mistakes - what counts is what we learn! 🌱",
    "Your financial future is bright! ☀️"
  ],
  
  celebratory: [
    "🎉 Fantastic! That's exactly the smart thinking I love to see!",
    "🏆 Victory! You just made an excellent financial decision!",
    "✨ Brilliant choice! Your wallet is definitely smiling!",
    "🚀 Amazing! You're really getting the hang of this!",
    "🎯 Bullseye! That decision aligns perfectly with your goals!",
    "💎 Gem of a choice! Your financial wisdom is shining!",
    "🌟 Stellar decision! You're truly mastering your money!",
    "🔥 On fire! Your financial discipline is incredible!"
  ],
  
  warning: [
    "🚨 Hold on! This might impact your budget more than you think!",
    "⚠️ Careful there! Let's think this through together!",
    "🛑 Pause for a moment! Is this aligned with your goals?",
    "💭 Before you decide, consider the bigger picture!",
    "⏰ This feels like it might be an impulse decision!",
    "🤔 Hmm, I'm sensing some emotional spending here!",
    "📊 The numbers suggest you might want to reconsider!",
    "🎭 Is this your emotions talking, or your financial plan?"
  ],
  
  analytical: [
    "Based on your spending patterns, here's what I've noticed...",
    "The data shows you tend to spend more when...",
    "Your budget analysis reveals...",
    "Compared to last month, you're...",
    "Looking at your financial trends...",
    "Your spending behavior suggests...",
    "The numbers tell an interesting story...",
    "From a financial wellness perspective..."
  ]
};

export interface SmartieResponse {
  message: string;
  emotion: 'happy' | 'concerned' | 'excited' | 'thoughtful' | 'proud';
  recommendation?: 'yes' | 'no' | 'think_again';
  confidence: number;
}

export function getSmartieMessage(
  type: keyof SmartiePersonality,
  customContext?: string
): string {
  const messages = smartiePersonality[type];
  const randomMessage = messages[Math.floor(Math.random() * messages.length)];
  
  if (customContext) {
    return `${randomMessage} ${customContext}`;
  }
  
  return randomMessage;
}

export function generateSmartieGreeting(timeOfDay: 'morning' | 'afternoon' | 'evening', userName?: string): string {
  const name = userName || "there";
  const greetings = {
    morning: [
      `Good morning, ${name}! ☀️ Ready to make some smart money moves today?`,
      `Rise and shine, ${name}! 🌅 Let's start this day with some financial wins!`,
      `Morning, ${name}! ☕ Time to brew up some great spending decisions!`
    ],
    afternoon: [
      `Good afternoon, ${name}! 🌞 How's your budget looking today?`,
      `Hey there, ${name}! 👋 Hope you're making smart choices this afternoon!`,
      `Afternoon, ${name}! ⏰ Perfect time to check in on your financial goals!`
    ],
    evening: [
      `Good evening, ${name}! 🌙 Time to reflect on today's financial wins!`,
      `Evening, ${name}! ✨ Let's see how you did with your money today!`,
      `Hey ${name}! 🌆 Winding down with some financial reflection?`
    ]
  };
  
  const timeGreetings = greetings[timeOfDay];
  return timeGreetings[Math.floor(Math.random() * timeGreetings.length)];
}

export function analyzeSpendingEmotion(emotionalTag?: string): SmartieResponse {
  if (!emotionalTag) {
    return {
      message: getSmartieMessage('analytical', "I notice you didn't tag this with an emotion. That's totally fine!"),
      emotion: 'thoughtful',
      confidence: 0.7
    };
  }

  const emotionAnalysis: Record<string, SmartieResponse> = {
    'stress': {
      message: "I see you're feeling stressed. Remember, retail therapy rarely fixes the underlying issue. Maybe try a walk or talking to a friend instead? 💙",
      emotion: 'concerned',
      confidence: 0.9
    },
    'boredom': {
      message: "Spending when bored is super common! Next time, try a free activity like reading, walking, or calling a friend. Your wallet will thank you! 😊",
      emotion: 'thoughtful',
      confidence: 0.8
    },
    'celebration': {
      message: "Celebrations deserve recognition! Just make sure this fits your budget. There are many ways to celebrate that don't break the bank! 🎉",
      emotion: 'happy',
      confidence: 0.7
    },
    'peer pressure': {
      message: "Peer pressure is tough! Remember, your friends who truly care about you will understand if you say no for budget reasons. Stay strong! 💪",
      emotion: 'concerned',
      confidence: 0.9
    },
    'impulse': {
      message: "Impulse purchases happen to everyone! The good news is recognizing it is the first step. Maybe sleep on big decisions? 🛌",
      emotion: 'thoughtful',
      confidence: 0.8
    },
    'necessity': {
      message: "Necessary expenses are part of life! You're being responsible by tracking them. Great job staying mindful of your spending! ✅",
      emotion: 'proud',
      confidence: 0.9
    },
    'reward': {
      message: "You deserve rewards for your hard work! Just make sure this reward aligns with your budget and goals. Balance is key! 🏆",
      emotion: 'excited',
      confidence: 0.8
    }
  };

  return emotionAnalysis[emotionalTag.toLowerCase()] || {
    message: getSmartieMessage('analytical', "Interesting emotional context! I'm always learning about spending psychology."),
    emotion: 'thoughtful',
    confidence: 0.6
  };
}

export function generateBudgetInsight(
  spent: number,
  limit: number,
  category: string
): SmartieResponse {
  const percentage = (spent / limit) * 100;
  
  if (percentage >= 100) {
    return {
      message: `Oops! You've exceeded your ${category} budget by £${(spent - limit).toFixed(2)}. Let's tighten up for the rest of the month! 🚨`,
      emotion: 'concerned',
      confidence: 1.0
    };
  } else if (percentage >= 80) {
    return {
      message: `You're at ${percentage.toFixed(0)}% of your ${category} budget. Time to slow down a bit! 🟡`,
      emotion: 'concerned',
      confidence: 0.9
    };
  } else if (percentage >= 50) {
    return {
      message: `Halfway through your ${category} budget! You're tracking well - keep it up! 📊`,
      emotion: 'thoughtful',
      confidence: 0.8
    };
  } else {
    return {
      message: `Great job! You're only at ${percentage.toFixed(0)}% of your ${category} budget. Excellent control! 🎯`,
      emotion: 'proud',
      confidence: 0.9
    };
  }
}

export function generateGoalMotivation(
  currentAmount: number,
  targetAmount: number,
  goalTitle: string
): SmartieResponse {
  const percentage = (currentAmount / targetAmount) * 100;
  
  if (percentage >= 100) {
    return {
      message: `🎉 GOAL ACHIEVED! You've reached your ${goalTitle} goal! Time to celebrate and set a new challenge!`,
      emotion: 'excited',
      confidence: 1.0
    };
  } else if (percentage >= 75) {
    return {
      message: `So close! You're ${percentage.toFixed(0)}% of the way to your ${goalTitle} goal. The finish line is in sight! 🏁`,
      emotion: 'excited',
      confidence: 0.9
    };
  } else if (percentage >= 50) {
    return {
      message: `Halfway there! Your ${goalTitle} progress is solid at ${percentage.toFixed(0)}%. Keep the momentum going! 💪`,
      emotion: 'proud',
      confidence: 0.8
    };
  } else if (percentage >= 25) {
    return {
      message: `Good start! You're ${percentage.toFixed(0)}% towards your ${goalTitle} goal. Every contribution counts! 📈`,
      emotion: 'happy',
      confidence: 0.7
    };
  } else {
    return {
      message: `Great goal! Starting to save for ${goalTitle} is a smart move. You've got this! 🚀`,
      emotion: 'excited',
      confidence: 0.8
    };
  }
}

export const smartieEmotions = {
  happy: "😊",
  concerned: "😰", 
  excited: "🤩",
  thoughtful: "🤔",
  proud: "😌"
};

export function getSmartieEmoji(emotion: SmartieResponse['emotion']): string {
  return smartieEmotions[emotion] || "🤖";
}
