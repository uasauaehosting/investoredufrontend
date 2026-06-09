export interface InvestmentProductSubItem {
  title: string;
  text: string;
}

export interface InvestmentProductBlock {
  heading?: string;
  paragraphs?: string[];
  bullets?: string[];
  subItems?: InvestmentProductSubItem[];
  source?: string;
  externalLink?: { label: string; url: string };
}

export interface InvestmentProduct {
  slug: string;
  title: string;
  imageUrl: string;
  excerpt: string;
  blocks: InvestmentProductBlock[];
}

export const INVESTMENT_PRODUCTS: InvestmentProduct[] = [
  {
    slug: 'introduction-to-financial-markets',
    title: 'Introduction to Financial Markets',
    imageUrl: 'http://uasa.ae/en/galorg/232220171122521.jpg',
    excerpt:
      'Learn what financial markets are, the main asset classes, and how participants trade stocks, bonds, currencies, and more.',
    blocks: [
      {
        heading: 'What are financial markets?',
        paragraphs: [
          'Financial markets are places where people and companies come to buy and sell assets like stocks, bonds (debt), commodities and other products.',
          'People have traded on financial markets for hundreds of years and they grew out of a very real practical need – to help people buy and sell things more efficiently, and to help companies that needed money to raise it more quickly.',
          'Over the years, markets have grown bigger and faster. More people than ever before are now able to get access to these markets. Once they were the preserve of big banks, finance houses and very wealthy individuals, but no longer.',
        ],
      },
      {
        heading: 'Types of asset classes',
        paragraphs: [
          'Traders are able to access a wide range of financial markets but what are the main markets available and how do they work?',
        ],
        subItems: [
          {
            title: 'Indices',
            text: 'Made up of a basket of shares, a stock market index can be traded like an individual share. By buying and selling indices, traders can speculate on the changes in price of the biggest companies in a single market. For example, the US 500 is one of the most widely traded indices globally – it is a measurement of some of the largest and most actively traded companies listed on the New York Stock Exchange or NASDAQ.',
          },
          {
            title: 'Currencies',
            text: "Also known as Forex or FX, the currency markets represent the constant exchange of currencies between banks and other market participants. Currencies are quoted as a currency 'pair' – for example GBP/USD is the value of US dollar to the pound. All currencies have a three letter code. The currency markets, unlike many other markets, are open 24 hrs.",
          },
          {
            title: 'Equities',
            text: 'Also known as share markets, these represent the prices of shares in companies that are listed (quoted) on major stock exchanges. Famous examples include Apple, BP or Microsoft.',
          },
          {
            title: 'Commodities',
            text: 'Many commodities are resources that are eventually consumed, for example oil or wheat. Most commodity markets fall in energy – like natural gas or crude oil, softs – like soybeans or wheat, and metals, like gold, silver or platinum. Each commodity market will have its own particular cycles, determined by specific factors like harvests or energy demands.',
          },
          {
            title: 'Bonds',
            text: 'Bonds are debt instruments issued by government which pay interest to investors, and which can also be traded. Popular bond markets include the UK and US government 10 year bonds.',
          },
          {
            title: 'Interest rates',
            text: 'Interest rates are set by central banks and represent the cost of borrowing for currencies controlled by those banks. The interest rates of the UK, US and Eurozone rates are frequently traded.',
          },
        ],
      },
      {
        heading: 'What affects the markets?',
        paragraphs: [
          'Market prices are driven by the supply and demand for goods which can be affected by a broad range of factors. Here are some of the most common:',
        ],
        bullets: [
          'News: Many market participants keep tabs on news in real-time; bad news affecting a company or a country will drive prices down, for example. Even political news can have a wide-reaching effect on markets',
          'Central bank policy: Central banks make decisions such as setting interest rates, and these can have a profound effect on the flow of money around the world, and will have a big impact on markets',
          'Company results: Companies listed on stock exchanges will release regular results which will encourage investors to buy or sell their shares',
          'Government data: Governments will release data which will move markets, like unemployment information or inflation data for example',
        ],
      },
      {
        heading: 'Market participants',
        paragraphs: ['There are a wide range of people and companies that trade in financial markets.'],
        bullets: [
          'Institutional investors: Pension funds, asset managers and mutual fund providers participate in financial markets to make profits for themselves and their customers',
          'Banks: Banks act like brokers for other companies, like fund managers. They used to do plenty of trading themselves, but new regulations mean they have less scope to trade their own book.',
          'Brokers: Specialists placing trades for their clients',
          'Market makers: Some institutions are tasked with selling shares or bonds into the market. Their job is to get the best price possible for their clients. For example, if a company decides to issue more shares, a market maker is given the job of selling them into the market.',
          'Retail investors: Everyday investors can participate in financial markets through investing in funds, buying shares, or actively trading the markets through spread bets and CFDs',
        ],
      },
      {
        heading: 'How are financial markets traded?',
        paragraphs: ['Typically, markets can be traded in two ways:'],
        subItems: [
          {
            title: 'On-exchange',
            text: 'In the past, these were actual buildings where brokers met to buy and sale shares in companies, or other assets, like corn or livestock. Now most trading on exchanges takes place online, with orders being placed from all over the world. Trading on exchange means that contracts are standardised with a clear guidance on the quality, quantity and when you will receive the goods.',
          },
          {
            title: 'Over-the-counter',
            text: 'This is where two parties agree to buy/sell to each other directly, without trading on an exchange.',
          },
        ],
        source: 'Source: www.cityindex.co.uk',
      },
    ],
  },
  {
    slug: 'introduction-to-exchange-traded-funds',
    title: 'Introduction to Exchange-Traded Funds',
    imageUrl: 'http://uasa.ae/en/galorg/13012017120129user3.jpg',
    excerpt:
      'Understand how ETFs work, their advantages over mutual funds, and popular examples traded on global exchanges.',
    blocks: [
      {
        paragraphs: [
          "Exchange-traded funds (ETFs) are a type of financial instrument whose unique advantages over mutual funds have caught the eye of many an investor. If you find the tasks of analyzing and picking stocks a little daunting, ETFs may be right for you. In this article we define ETFs, highlight their advantages, and list some of the most popular ETFs available to investors.",
        ],
      },
      {
        heading: 'What Is an ETF?',
        paragraphs: [
          "Think of an ETF as a mutual fund that trades like a stock. Just like a mutual fund, an ETF represents a basket of stocks that reflect an index such as the S&P 500. An ETF, however, isn't a mutual fund; it trades just like any other company on a stock exchange. Unlike a mutual fund that has its net-asset value (NAV) calculated at the end of each trading day, an ETF's price changes throughout the day, fluctuating with supply and demand. It is important to remember that while ETFs attempt to replicate the return on indexes, there is no guarantee that they will do so exactly. It is not uncommon to see a 1% or more difference between the actual index's year-end return and that of an ETF.",
          'By owning an ETF, you get the diversification of a mutual fund plus the flexibility of a stock. Because ETFs trade like stocks, you can short sell them, buy them on margin and purchase as little as one share. Another advantage is that the expense ratios of most ETFs are lower than that of the average mutual fund. When buying and selling ETFs, you pay your broker the same commission that you\'d pay on any regular trade.',
        ],
      },
      {
        heading: 'Varieties of ETFs',
        paragraphs: [
          'The first ETF was the S&P 500 index fund (nicknamed spiders because of their SPDR ticker symbol), which began trading on the American Stock Exchange (AMEX) in 1993. Today - tracking a wide variety of sector-specific, country-specific and broad-market indexes - there are hundreds of ETFs trading on the open market.',
          'You can pretty much find an ETF for just about any kind of sector of the market. For example, if you were interested in the Austrian market you might take a look at the iShares MSCI Austrian Index fund (ticker EWO).',
          'Some of the more popular ETFs have nicknames like cubes (QQQ) and diamonds (DIAs). Most ETFs are passively managed, meaning investors save big on management fees. Below you will find a closer look at some of the more popular ETFs:',
        ],
        subItems: [
          {
            title: 'Nasdaq-100 Index Tracking Stock (Nasdaq:QQQ)',
            text: 'This ETF represents the Nasdaq-100 Index, which consists of the 100 largest and most actively traded non-financial stocks on the Nasdaq, QQQ offers broad exposure to the tech sector. Because it curbs the risk that comes with investing in individual stocks, the QQQ is a great way to invest in the long-term prospects of the technology industry. The diversification it offers can be a huge advantage when there\'s volatility in the markets. If a tech company falls short of projected earnings, it will likely be hit hard. Between 2000 and 2004, QQQ was by far the most heavily traded index fund.',
          },
          {
            title: 'SPDRs',
            text: 'Usually referred to as spiders, these investment instruments bundle the benchmark S&P 500 and give you ownership in the index. Imagine the trouble and expenses involved in trying to buy all 500 stocks in the S&P 500! SPDRs allow individual investors to own the index\'s stocks in a cost-effective manner. Another nice feature of SPDRs is that they divide various sectors of the S&P 500 stocks and sell them as separate ETFs, there are literally dozens of these types of ETFs. The "technology select sector index", for example, contains over 85 stocks covering products developed by companies such as defense manufacturers, telecommunications equipment, microcomputer components and integrated computer circuits. This ETF trades under the symbol XLK on the AMEX.',
          },
          {
            title: 'iShares',
            text: 'iShares is Barclay\'s (Barclay\'s Global Investors "BGI") brand of ETFs. In 2009 there were approximately 350 iShares trading with around $300 billion under management. Barclay has put out a number of iShares that follow many of the major indexes around the world including the Nasdaq, NYSE, Dow Jones, and Standard & Poor\'s. All of these particular ETFs trade on the major exchanges in the U.S. just like normal stocks.',
          },
          {
            title: 'United States Natural Gas (NYSE:UNG)',
            text: 'Funds can also provide a way to invest in natural resources. This investments gives a replication of natural gas prices, after expenses. It will try to follow the prices of natural gas by buying futures contracts on natural gas in the coming months. As with all funds you need to keep an eye on the total expense ratio before investing.',
          },
          {
            title: 'iShares MSCI Emerging Market Index (NYSE:EEM)',
            text: 'This investment attempts to mimic the returns seen in the MSCI Emerging Markets index which was created as an equity benchmark for international security performance. If you would like to gain some international exposure, specifically to emerging markets, this ETF might be for you.',
          },
          {
            title: 'Vanguard ETFs®',
            text: 'Just like iShares are Barclay\'s brand of ETFs, Vanguard ETFs® are Vanguard\'s brand of the financial instrument. Vanguard also offers dozens upon dozens of ETFs for many different areas of the market including the financial, healthcare and utilities sectors.',
          },
          {
            title: 'Direxion Daily Financial Bear 3X Shares (NYSE:FAZ)',
            text: 'Not all ETFs are designed to move in the same direction or even in the same amount as the index they are tracking. For example, this triple bear fund attempts to perform 300% in the opposite direction of the Russell 1000 Financial Services Index. This fund became popular in 2008 and 2009 when the financial crisis placed downward pressure on financial stocks.',
          },
          {
            title: 'DIAMONDs',
            text: 'These ETF shares, Diamonds Trust Series I, track the Dow Jones Industrial Average. The fund is structured as a unit investment trust. The ticker symbol of the Dow Diamonds is (NYSE:DIA), and it trades on the New York Stock Exchange.',
          },
        ],
      },
      {
        heading: 'Conclusion',
        paragraphs: [
          'A great reason to consider ETFs is that they simplify index and sector investing in a way that is easy to understand. If you feel a turnaround is around the corner, go long. If, however, you think ominous clouds will be over the market for some time, you have the option of going short.',
          'The combination of the instant diversification, low cost and the flexibility that ETFs offer, makes these instruments one of the most useful innovations and attractive pieces of financial engineering to date.',
        ],
        externalLink: {
          label: 'Introduction To Exchange-Traded Funds',
          url: 'https://www.investopedia.com/articles/01/082901.asp',
        },
      },
    ],
  },
  {
    slug: 'introduction-to-the-basics-of-mutual-funds',
    title: 'Introduction to the Basics of Mutual Funds',
    imageUrl: 'http://uasa.ae/en/galorg/232920171129181.jpg',
    excerpt:
      'Discover how mutual funds pool investor money, the benefits of professional management, and key fee considerations.',
    blocks: [
      {
        paragraphs: [
          'Mutual funds offer a way for a group of investors to effectively pool their money so they can invest in a wider variety of investment vehicles and take advantage of professional money management through the purchase of one mutual fund share. Mutual fund companies essentially collect the money from their investors, or shareholders, and invest that pooled money into individual investment vehicles according to some risk profile, money management philosophy, or financial goal.',
          'The mutual fund then passes along the profits (and losses) of those investments to its shareholders.',
        ],
      },
      {
        heading: 'What Makes Mutual Funds Good Investment Options',
        paragraphs: [
          'Mutual funds are one of the most highly utilized investment options among average investors and financial professionals alike. But why is investing in a mutual fund a good idea? While some mutual funds are objectively better investment than others (and even others that serve very specific investment needs), what mutual funds grant investors access to is perhaps the most important benefit.',
          "First and foremost, mutual funds grant investors access to a wide variety of investments that they otherwise may not carry in their portfolio as individual securities. Since mutual funds invest in a diverse range of securities and investment options, one mutual fund share actually represents proportionate ownership in each and every investment in the mutual fund's portfolio.",
          "Of most interest to investors is that each share also proportionately represents the profits of those investments as mutual funds are required to pass along profits to their investors by way of mutual fund distributions, which come in several forms. In a mutual fund, the value of your shares goes up and down as the value of the stocks and bonds in the fund rise and fall.",
          "For the average investor to have the same exposure to those investment options and potential profits on their own would be extremely costly both in terms of the actual investment dollars and in terms of time.",
          "Additionally, investing in a mutual fund is generally a cost-effective way to gain access to professional money management. Were an individual investor to try to invest in individual securities and actively manage them the way a mutual fund's manager does, it could very easily become a full-time job (as is for the professional fund managers of the world!). In order to make wise investment decisions when you buy individual stocks and bonds yourself, at the very least you'd have to have the knowledge to do extensive research on various types of businesses in general (automobile, construction, medical) and on specific companies (GE, IBM, Microsoft). This is work that most of us are not interested in, do not have the time for, and, most importantly, are probably not as qualified to do. But through purchasing shares of a mutual fund, you are also purchasing the money management and investment skills of the fund manager whose job it is to invest and reinvest the mutual fund's capital based on the fund's established goals.",
          "While mutual funds offer these benefits to their investors, it doesn't come for free.",
        ],
      },
      {
        heading: 'Mutual Fund Fees Cover Administrative Costs',
        paragraphs: [
          "Each investor is charged a percentage of his or her investment to help cover all the costs of running the mutual fund, including having a professional fund manager as well as researching, buying, and selling stocks. But again, investors can benefit from their collective investments. Mutual fund fees are spread out over all of the investors, so the costs to each individual investor is still much less than it would have been if he or she had purchased the stocks directly and paid a broker or financial advisor to manage the investments. Though many mutual fund options are indeed cost-effective, there are many types of mutual fund fees, from front-load fees to constant-load fees, so it is always best to be aware of the type of fee and how it is calculated before investing in a mutual fund.",
        ],
      },
      {
        heading: 'Other Types of Mutual Funds: Index Funds',
        paragraphs: [
          "Today, not all funds are managed by a financial manager. Index funds use a computer program to buy all of the stock in a particular index, such as the Russell 3000 or the S&P 500, regardless of how they're performing. They don't have to do research or try to time the movement in the market to buy or sell at the \"right\" time. Index fund fees, therefore, are generally much lower than the fees for managed funds, and, therefore, the return on investment is higher.",
        ],
        source: 'Source: www.thebalance.com',
      },
    ],
  },
];

export function getInvestmentProduct(slug: string): InvestmentProduct | undefined {
  return INVESTMENT_PRODUCTS.find((product) => product.slug === slug);
}
