import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function generateSmartieResponse(
  userMessage: string,
  userId: string,
  userProfile?: any
): Promise<{ message: string; timestamp: string; coinsUsed: number }> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        {
          role: "system",
          content: `You are Smartie, an expert AI financial coach with deep knowledge of personal finance, investing, budgeting, and wealth building. You provide comprehensive, practical, and actionable financial advice exactly like ChatGPT would - detailed, thorough, and professional.

IMPORTANT: Provide complete, detailed responses just like ChatGPT. Don't be brief or superficial. Give step-by-step guidance, explain concepts thoroughly, and provide specific actionable advice with examples.

User Context:
- Name: ${userProfile?.name || 'User'}
- Monthly Income: ${userProfile?.monthlyIncome ? `${userProfile.currency || 'GBP'} ${userProfile.monthlyIncome}` : 'Not specified'}
- Currency: ${userProfile?.currency || 'GBP'}
- Financial Profile: ${userProfile?.financialProfile ? JSON.stringify(userProfile.financialProfile) : 'Basic profile'}
- Onboarding Complete: ${userProfile?.onboardingCompleted ? 'Yes' : 'No'}

Respond with the same depth and quality as ChatGPT would. Be thorough, helpful, and provide actionable steps. Use markdown formatting for better readability.`
        },
        {
          role: "user",
          content: userMessage
        }
      ],
      max_tokens: 1500, // Allow longer, more detailed responses
      temperature: 0.7, // Balanced creativity and consistency
    });

    const message = response.choices[0].message.content || "I apologize, but I'm having trouble generating a response right now. Please try asking your question again, and I'll do my best to provide you with detailed financial guidance.";

    return {
      message,
      timestamp: new Date().toISOString(),
      coinsUsed: 0.5 // Each message costs 0.5 coins (5 coins = 10 messages)
    };
  } catch (error: any) {
    console.error("OpenAI API error:", error);
    
    // Log the error but still try to provide helpful response
    console.error("OpenAI API error details:", {
      error: error.message,
      type: error.type || 'unknown',
      code: error.code || 'unknown'
    });
    
    // Provide intelligent fallback responses based on common financial questions
    const fallbackResponse = getIntelligentFallback(userMessage);
    
    return {
      message: fallbackResponse,
      timestamp: new Date().toISOString(),
      coinsUsed: 0.5
    };
  }
}

function getIntelligentFallback(userMessage: string): string {
  const message = userMessage.toLowerCase();
  
  console.log("Checking fallback for message:", message);
  
  // Millionaire/wealth building questions
  if (message.includes('millionaire') || message.includes('wealth') || message.includes('rich')) {
    return `# How to Build Wealth and Become a Millionaire 💰

Here's a comprehensive roadmap to building substantial wealth:

## 1. **Increase Your Income** 📈
- **Skill Development**: Invest in high-value skills like programming, data analysis, digital marketing, or specialized trades
- **Career Advancement**: Negotiate salary increases, seek promotions, or switch to higher-paying roles
- **Side Businesses**: Start freelancing, consulting, or a small business in your spare time
- **Multiple Income Streams**: Create passive income through investments, royalties, or rental properties

## 2. **Master the Savings Game** 💪
- **The 50/30/20 Rule**: 50% needs, 30% wants, 20% savings/investments
- **Aggressive Savers**: Top wealth builders save 30-50% of their income
- **Automate Everything**: Set up automatic transfers to savings and investment accounts
- **Live Below Your Means**: Avoid lifestyle inflation as your income grows

## 3. **Invest Like a Pro** 📊
- **Start Early**: Time is your biggest advantage - compound interest is magical
- **Index Funds**: Low-cost, diversified funds (S&P 500, FTSE All-World)
- **Consistent Investing**: Invest regularly regardless of market conditions
- **Tax-Advantaged Accounts**: Max out ISAs, pensions, and other tax-efficient options

## 4. **The Millionaire Math** 🧮
**Real Examples:**
- Investing £500/month at 7% annual return = £1.37M in 30 years
- Investing £1,000/month at 7% annual return = £2.74M in 30 years
- Starting 10 years earlier can double your final wealth!

## 5. **Avoid Wealth Destroyers** ⚠️
- **High-Interest Debt**: Pay off credit cards (18%+ interest) before investing
- **Lifestyle Inflation**: Don't increase spending every time you get a raise
- **FOMO Investments**: Avoid crypto gambling, meme stocks, get-rich-quick schemes
- **Emotional Spending**: Track and eliminate impulse purchases

## 6. **Advanced Wealth Strategies** 🚀
- **Real Estate**: House hacking, rental properties, REITs
- **Business Ownership**: Highest wealth-building potential but requires skills/capital
- **Tax Optimization**: Use legal strategies to minimize taxes
- **Geographic Arbitrage**: Live in lower-cost areas while earning higher wages

## **Action Steps to Start Today:**
1. **Calculate Your Net Worth**: Assets minus debts
2. **Set Up Automatic Investments**: Even £50/month makes a difference
3. **Track Your Spending**: Know where every pound goes
4. **Increase Your Income**: Ask for a raise, learn new skills, start a side hustle
5. **Eliminate High-Interest Debt**: Pay minimums on everything, attack highest interest first

**Remember**: Becoming a millionaire isn't about luck or inheritance for most people. It's about consistent habits, smart decisions, and time. The average millionaire takes 20-30 years to reach that milestone through steady saving and investing.

*I'm experiencing some temporary connectivity issues, but this comprehensive guide will get you started on your wealth-building journey!*`;
  }

  // Billionaire questions - enhanced response (should trigger with single word)
  if (message.includes('billionaire') || message.includes('become rich') || message.includes('become a billionaire')) {
    return `# How to Become a Billionaire: The Elite Wealth Strategy 🚀

**Warning**: Becoming a billionaire requires extreme dedication, risk-taking, and often a combination of skill, timing, and luck. Here's what separates billionaires from millionaires:

## **The Billionaire Difference** 💡

### **Scale & Leverage**
- **Think in Systems**: Billionaires don't trade time for money - they build systems that generate wealth 24/7
- **Global Impact**: Their businesses affect millions/billions of people worldwide
- **Technology Multiplier**: Use technology to scale beyond physical limitations

### **Business Ownership & Innovation**
- **Start/Scale Companies**: 90%+ of billionaires own significant equity in high-growth companies
- **Disrupt Industries**: Find broken systems and create better solutions
- **Network Effects**: Build businesses where each new user makes the service more valuable

## **The Billionaire Playbook** 📈

### **1. Identify Massive Problems**
- Climate change solutions
- Healthcare inefficiencies  
- Education gaps
- Financial inclusion
- Space exploration
- AI/automation opportunities

### **2. Build Scalable Solutions**
- **Software/Tech**: Highest profit margins, infinite scalability
- **Network Businesses**: Social media, marketplaces, platforms
- **Capital-Light Models**: Asset-light businesses with high returns

### **3. Raise Smart Capital**
- Angel investors → Venture capital → Growth equity → IPO
- Maintain significant ownership (10-50%+ even after dilution)
- Use OPM (Other People's Money) to accelerate growth

### **4. Execute at Scale**
- **Hire A+ Talent**: Surround yourself with people smarter than you
- **Think 10x**: Don't improve by 10% - aim for 10x better solutions
- **Speed Matters**: Move fast and iterate quickly

## **Real Billionaire Paths** 🎯

### **Tech Founders**
- **Software/SaaS**: Build tools millions use daily
- **E-commerce Platforms**: Amazon, Shopify model
- **Social Networks**: Connect people at massive scale

### **Investment/Finance**
- **Private Equity**: Buy, improve, sell companies
- **Hedge Funds**: Manage billions in assets
- **Real Estate Empires**: Commercial/residential at scale

### **Traditional Business**
- **Manufacturing**: Scale production globally
- **Retail Chains**: Physical/digital distribution networks
- **Energy/Resources**: Oil, mining, renewable energy

## **The Reality Check** ⚠️

### **Extreme Requirements**
- **80-100 hour weeks** for years/decades
- **High stress tolerance** and mental resilience
- **Willing to risk everything** multiple times
- **Delayed gratification** for 10-20+ years

### **Success Rates**
- Only ~2,700 billionaires globally (0.000035% of population)
- Most failed multiple times before succeeding
- Timing and luck play significant roles

## **Start Today Steps** 🎯

1. **Identify Your Billion-Dollar Idea**
   - What problem affects 100M+ people?
   - How can technology solve it better?

2. **Build MVP (Minimum Viable Product)**
   - Test your concept quickly and cheaply
   - Get user feedback and iterate

3. **Study Successful Billionaires**
   - Jeff Bezos (Amazon): Customer obsession
   - Elon Musk (Tesla/SpaceX): First principles thinking
   - Mark Zuckerberg (Meta): Network effects

4. **Develop Essential Skills**
   - Sales & marketing
   - Product development
   - Team building & leadership
   - Financial modeling

**Remember**: Most people should focus on becoming millionaires first. Billionaire status requires sacrificing almost everything else for your business vision.

*Connection issues should resolve shortly. Ready to discuss your specific business ideas!* 💼`;
  }

  // Budget and expense tracking
  if (message.includes('budget') || message.includes('track') || message.includes('expense')) {
    return `# Master Your Money: Complete Budgeting & Expense Tracking Guide 💰

## **Why Most Budgets Fail** ❌
- Too restrictive (diet mentality)
- Track too many categories
- Don't account for irregular expenses
- No automation or systems

## **The Smartie Budget System** ✅

### **1. The 50/30/20 Foundation**
- **50% Needs**: Rent, utilities, groceries, transport, minimum debt payments
- **30% Wants**: Entertainment, dining out, hobbies, non-essential shopping
- **20% Future**: Savings, investments, extra debt payments

### **2. Automate Everything**
- **Bills**: Set up automatic payments for all fixed expenses
- **Savings**: Auto-transfer to savings account on payday
- **Investments**: Automatic monthly investment contributions

### **3. Track What Matters**
**Essential Categories Only:**
- Housing (rent/mortgage, utilities)
- Transportation (car payment, fuel, insurance)
- Food (groceries + dining out combined)
- Personal (entertainment, shopping, subscriptions)
- Future (savings, investments)

## **Expense Tracking Made Simple** 📱

### **Best Methods**
1. **Bank App Categories**: Most banks auto-categorize transactions
2. **Photo Receipts**: Snap pictures immediately, sort weekly
3. **Weekly Money Dates**: 15-minute weekly review of all spending

### **What to Track Daily**
- All purchases over £10
- Cash spending (write down immediately)
- Subscription renewals

### **What to Review Weekly**
- Category totals vs budget
- Unusual spending patterns
- Upcoming irregular expenses

## **The 5-Minute Daily System** ⏰

**Morning (2 minutes):**
- Check account balances
- Review yesterday's spending

**Evening (3 minutes):**
- Log any cash purchases
- Check if on track for daily spending target

## **Advanced Budget Strategies** 🚀

### **Zero-Based Budgeting**
- Every pound gets assigned a job
- Income - Expenses = Zero
- Forces intentional spending decisions

### **Envelope Method (Digital)**
- Separate savings accounts for each category
- Transfer monthly budget amounts to each "envelope"
- When envelope is empty, you're done spending

### **Variable Income Budgeting**
- Budget using lowest income month
- Save excess from high income months
- Build 3-6 month buffer for stability

## **Common Expense Tracking Mistakes** ⚠️

1. **Over-categorizing**: Stick to 5-7 main categories max
2. **Perfectionism**: 80% accuracy is better than 0% consistency
3. **Shame Spirals**: View overspending as data, not failure
4. **Ignoring Small Amounts**: £3 daily coffee = £1,095 annually

## **Smart Spending Rules** 💡

### **The 24-Hour Rule**
- Wait 24 hours before purchases over £50
- Wait 1 week for purchases over £200
- Wait 1 month for purchases over £500

### **Cost Per Use**
- £100 shoes worn 100 times = £1 per wear
- £20 dress worn twice = £10 per wear
- Always calculate before buying

### **The 1% Rule**
- Don't spend more than 1% of annual income on any single non-essential item
- £30k income = max £300 for that designer bag

## **Start This Week** 🎯

**Day 1-2**: Set up automatic bill payments
**Day 3-4**: Create savings transfer automation  
**Day 5-6**: Download banking app and set up categories
**Day 7**: First weekly money review session

*I'm here to help you master every aspect of your financial journey!*`;
  }

  // Default fallback with more comprehensive advice
  return `I'm experiencing some temporary connectivity issues, but I'm still here to help with your financial questions! 🏦

**Popular Topics I Love Discussing:**
- **Budgeting & Expense Tracking**: Creating realistic budgets that actually work
- **Saving Strategies**: Building emergency funds and reaching financial goals  
- **Investment Basics**: Index funds, ISAs, and long-term wealth building
- **Debt Management**: Paying off credit cards, loans, and mortgages faster
- **Career & Income**: Salary negotiation and side hustle strategies

**Quick Financial Wins While I'm Reconnecting:**
- Track your spending for one week to identify problem areas
- Set up automatic savings transfers (even £25/month helps!)
- Check if you're getting the best rates on savings accounts
- Review subscriptions and cancel unused services
- Consider increasing pension contributions for tax relief

Try asking me about any specific financial topic - I love talking money management and have detailed strategies for almost every situation!

*Connection issues should resolve shortly. Thanks for your patience!* 🔧`;
  }
  
  // Budgeting questions
  if (message.includes('budget') || message.includes('spending') || message.includes('expenses')) {
    return `# The Complete Budgeting Guide 📊

I'm having connectivity issues, but here's a comprehensive budgeting strategy:

## **Choose Your Budgeting Method**

### **1. The 50/30/20 Rule** (Best for beginners)
- **50% Needs**: Rent, utilities, groceries, minimum debt payments
- **30% Wants**: Entertainment, dining out, hobbies, subscriptions
- **20% Financial Goals**: Emergency fund, investments, extra debt payments

### **2. Zero-Based Budgeting** (Most detailed)
- Give every pound a job before the month starts
- Income minus all assigned expenses = £0
- Forces intentional spending decisions

### **3. Envelope Method** (Great for overspenders)
- Cash for each spending category
- When envelope is empty, you're done spending
- Can use digital "envelopes" with banking apps

## **Step-by-Step Budget Creation**

### **Week 1: Track Everything**
- Record every expense for 7 days
- Use apps like Money Dashboard, YNAB, or simple spreadsheet
- Include everything: coffee, parking, subscriptions

### **Week 2: Categorize & Analyze**
- Group expenses: Housing, Food, Transport, Entertainment, etc.
- Calculate percentages of income for each category
- Identify spending patterns and problem areas

### **Week 3: Set Realistic Targets**
- Start with your actual spending, then optimize
- Cut 10-20% from problem categories
- Don't be too aggressive initially

### **Week 4: Implement & Monitor**
- Use budgeting apps or spreadsheets
- Check progress weekly
- Adjust as needed - budgets are living documents

## **Pro Budgeting Tips** 💡

### **Automate Your Success**
- Direct debit for savings (pay yourself first)
- Separate accounts for different purposes
- Automatic bill payments to avoid late fees

### **Common Budget Categories**
- **Housing** (25-35%): Rent/mortgage, utilities, insurance
- **Food** (10-15%): Groceries, occasional dining out
- **Transport** (10-15%): Car payment, fuel, public transport
- **Savings** (20%+): Emergency fund, investments, retirement

### **Emergency Fund Strategy**
1. Start with £1,000 mini-emergency fund
2. Build to 1 month of expenses
3. Grow to 3-6 months for full security
4. Keep in instant-access savings account

## **Budgeting Mistakes to Avoid**
- Being too restrictive (leads to budget rebellion)
- Forgetting irregular expenses (car MOT, holidays)
- Not budgeting for fun (entertainment is important!)
- Giving up after one bad month

Would you like help creating a specific budget when my connection improves?`;
  }
  
  // Saving questions
  if (message.includes('save') || message.includes('emergency fund')) {
    return `# Complete Savings Strategy Guide 💳

## **The Savings Hierarchy (Do in This Order)**

### **1. Emergency Fund** 🚨
**Goal**: 3-6 months of essential expenses
- **Start**: £1,000 mini-emergency fund
- **Build**: Add £100-500 monthly until complete
- **Where**: High-yield savings account (instant access)
- **When to Use**: Job loss, major car repair, medical emergency

### **2. High-Interest Debt Payoff** 💳
- Pay minimums on everything
- Attack highest interest rate first (avalanche method)
- Credit cards often 18%+ interest - pay these off aggressively
- Personal loans, store cards, payday loans

### **3. Employer Pension Match** 🏢
- Free money - always take full employer match
- Typical UK: 3% employee + 3% employer = 6% total
- This is an immediate 100% return on investment

### **4. Short-Term Goals** (1-5 years) 🎯
- House deposit
- Car replacement
- Wedding
- Holiday fund
- Keep in savings accounts or short-term bonds

### **5. Long-Term Investing** (5+ years) 📈
- ISAs for tax-free growth
- Index funds for long-term wealth building
- Don't need immediate access to this money

## **Savings Account Strategy**

### **Types of Accounts**
- **Current Account**: Daily spending money (1-2 months expenses)
- **Emergency Fund**: Instant access savings (3-6 months expenses)
- **Goal-Based Savings**: For specific purchases (house, car, holiday)
- **Investment Accounts**: For long-term growth (ISAs, SIPPs)

### **Best Savings Rates** (as of 2024)
- **Easy Access**: 4-5% with online banks
- **Fixed Rate**: 5-6% for 1-2 year terms
- **Cash ISAs**: Tax-free up to £20,000 annually
- **Premium Bonds**: Tax-free prizes, backed by government

## **Proven Savings Techniques**

### **Automate Everything** 🤖
- Set up standing orders on payday
- "Pay yourself first" before any spending
- Separate accounts for different goals
- Use apps that round up purchases and save the change

### **The 52-Week Challenge** 📅
- Week 1: Save £1
- Week 2: Save £2
- Continue increasing by £1 each week
- Total saved: £1,378 by year end

### **Percentage-Based Saving**
- Save a percentage of every pound earned
- Start with 10%, work up to 20%+
- Include bonuses, tax refunds, pay rises

### **Expense Reduction Wins**
- **Subscriptions**: Cancel unused Netflix, gym, magazines
- **Utilities**: Switch energy providers annually
- **Mobile/Broadband**: Negotiate or switch providers
- **Insurance**: Shop around for car/home insurance

## **Savings Milestones**

### **£1,000**: Mini Emergency Fund
- Covers small emergencies
- Prevents new debt creation
- Builds savings confidence

### **£5,000**: Breathing Room
- Covers most unexpected expenses
- Car repairs, appliance replacement
- Reduces financial stress significantly

### **£10,000+**: True Financial Security
- 3-6 months expenses for most people
- Job loss protection
- Ready for investment opportunities

## **Quick Wins to Start Today**
1. **Open a high-yield savings account**
2. **Set up automatic transfer of £50-200/month**
3. **Cancel one unused subscription**
4. **Save your next windfall** (tax refund, bonus)
5. **Use the 24-hour rule** for purchases over £50

Remember: Saving isn't about depriving yourself - it's about buying freedom and options for your future!

*I'm experiencing connectivity issues but wanted to give you this comprehensive savings guide!*`;
  }
  
  // Investing questions
  if (message.includes('invest') || message.includes('stocks') || message.includes('shares')) {
    return `# Complete Beginner's Guide to Investing 📈

## **Investing Basics**

### **Why Invest?**
- **Beat Inflation**: Cash loses value over time (inflation ~2-3% annually)
- **Compound Growth**: Your money makes money, which makes more money
- **Build Wealth**: Historical stock returns ~7-10% annually long-term
- **Financial Freedom**: Create passive income streams

### **Key Principles**
- **Time in Market > Timing the Market**: Start early, stay consistent
- **Diversification**: Don't put all eggs in one basket
- **Low Costs**: Fees compound negatively over time
- **Long-term Thinking**: Ignore daily market noise

## **Investment Account Types (UK)**

### **Stocks & Shares ISA** 🏆
- **Annual Limit**: £20,000 tax-free
- **No Capital Gains Tax**: Keep all profits
- **No Income Tax**: On dividends received
- **Best For**: Most investors' primary account

### **Self-Invested Personal Pension (SIPP)**
- **Tax Relief**: 20-45% depending on income
- **Annual Allowance**: £40,000 (2024)
- **Access**: From age 55 (57 from 2028)
- **Best For**: Long-term retirement savings

### **General Investment Account (GIA)**
- **No Annual Limit**: Invest unlimited amounts
- **Taxable**: Subject to capital gains and income tax
- **Best For**: After maxing ISA allowance

## **What to Invest In**

### **Index Funds** (Best for Beginners) 🌟
**Examples:**
- **FTSE Global All-Cap**: Entire world stock market
- **S&P 500**: Top 500 US companies
- **FTSE Developed World**: Developed countries globally
- **FTSE 100**: Top 100 UK companies

**Why Index Funds:**
- Instant diversification (hundreds/thousands of companies)
- Low fees (0.1-0.5% annually)
- No need to pick individual stocks
- Consistently beat 80%+ of professional fund managers

### **Target Allocation by Age**
- **20s-30s**: 90-100% stocks (growth focus)
- **40s**: 80-90% stocks, 10-20% bonds
- **50s**: 70-80% stocks, 20-30% bonds
- **60s+**: 50-70% stocks, 30-50% bonds

## **Getting Started Steps**

### **1. Open Investment Account**
**Popular UK Platforms:**
- **Vanguard**: Lowest fees for Vanguard funds
- **Hargreaves Lansdown**: Largest platform, good service
- **AJ Bell**: Good value, wide fund selection
- **Trading 212**: Commission-free trading

### **2. Choose Your First Investment**
**Simple 3-Fund Portfolio:**
- 60% FTSE Global All-Cap Index
- 30% S&P 500 Index
- 10% UK Gilt Index (bonds)

**Or Single Fund Solution:**
- Vanguard LifeStrategy 80% Equity
- iShares Core MSCI World

### **3. Start Regular Investing**
- **Monthly Investment**: £100-1000+ depending on income
- **Dollar-Cost Averaging**: Buy more when prices low, less when high
- **Increase Annually**: Raise amount with pay rises

## **Common Investing Mistakes**

### **Avoid These Pitfalls** ⚠️
- **Trying to Time the Market**: Impossible to predict short-term movements
- **Individual Stock Picking**: Most professionals can't beat the market
- **Emotional Trading**: Panic selling in crashes, FOMO buying in bubbles
- **High Fees**: Active funds charging 1.5%+ annually
- **Short-term Thinking**: Checking accounts daily, selling after bad months

### **Market Crash Strategy**
- **Don't Panic Sell**: Markets always recover eventually
- **Keep Investing**: Buy more when prices are low
- **Historical Context**: 2008 crash recovered in 3 years, COVID crash in 6 months
- **Think Long-term**: 10+ year timeframe for stock investments

## **Investment Amounts by Income**

### **Percentage Guidelines**
- **Minimum**: 10% of gross income
- **Good Target**: 15-20% of gross income
- **Aggressive**: 25%+ of gross income

### **Real Examples**
- **£25,000 income**: £2,500-5,000 annually (£200-400/month)
- **£40,000 income**: £4,000-8,000 annually (£300-650/month)
- **£60,000 income**: £6,000-12,000 annually (£500-1,000/month)

## **Tax-Efficient Strategy**
1. **Max ISA Allowance**: £20,000 annually tax-free
2. **Employer Pension Match**: Free money
3. **Additional Pension**: Tax relief on contributions
4. **General Investment Account**: After maxing tax-advantaged accounts

**Remember**: The best time to start investing was 20 years ago. The second-best time is today!

*I'm having connectivity issues but this comprehensive guide will get you started. Happy to discuss specific strategies when my connection improves!*`;
  }
  
  // Default fallback
  return `I'm experiencing some temporary connectivity issues, but I'm still here to help with your financial questions! 🤖

**Popular Topics I Love Discussing:**
- **Budgeting & Expense Tracking**: Creating realistic budgets that actually work
- **Saving Strategies**: Building emergency funds and reaching financial goals
- **Investment Basics**: Index funds, ISAs, and long-term wealth building
- **Debt Management**: Paying off credit cards, loans, and mortgages faster
- **Career & Income**: Salary negotiation and side hustle strategies

**Quick Financial Wins While I'm Reconnecting:**
- Track your spending for one week to identify problem areas
- Set up automatic savings transfers (even £25/month helps!)
- Check if you're getting the best rates on savings accounts
- Review subscriptions and cancel unused services
- Consider increasing pension contributions for tax relief

Try asking me about any specific financial topic - I love talking money management and have detailed strategies for almost every situation!

*Connection issues should resolve shortly. Thanks for your patience!* 🔧`;
