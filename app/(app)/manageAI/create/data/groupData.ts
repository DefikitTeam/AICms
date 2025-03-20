export interface Setting {
    name: string;
    label: string;
    placeholder: string;
    type: 'boolean' | 'text' | 'number';
    description: string;
}

export interface Feature {
    name: string;
    description: string;
    configGuide: string;
    settings: Setting[];
}

interface PlatformFeatures {
    name: string;
    description: string,
    configGuide: string
    features: Record<string, Feature>;
}

interface SocialMediaConfig {
    platforms: Record<string, PlatformFeatures>;
}

const socialMediaConfig: SocialMediaConfig = {
    platforms: {
        twitter: {
            name: 'Twitter Automation Settings',
            description: 'Automate Twitter posts, searches, sharing, following, and direct messages.',
            configGuide: 'Enable or disable automation features while complying with Twitter policies.',
            features: {
                post: {
                    name: 'Twitter Post Automation',
                    description: 'Allows posting tweets to the Twitter timeline as the configured agent.',
                    configGuide: 'Enable this option to allow the agent to post tweets at specified intervals. Configure the timing and immediate posting options below.',
                    settings: [
                        {
                            name: 'TWITTER_POST_ENABLE',
                            label: 'Enable Twitter Posting',
                            placeholder: 'FALSE',
                            type: 'boolean',
                            description: 'Enable or disable posting tweets to Twitter.'
                        },
                        {
                            name: 'POST_INTERVAL_MIN',
                            label: 'Post Interval Min (minutes)',
                            placeholder: '120',
                            description: 'Minimum interval in minutes between posts. Default: 120.',
                            type: 'number'
                        },
                        {
                            name: 'POST_INTERVAL_MAX',
                            label: 'Post Interval Max (minutes)',
                            placeholder: '180',
                            description: 'Maximum interval in minutes between posts. Default: 180.',
                            type: 'number'
                        },
                        {
                            name: 'POST_IMMEDIATELY',
                            label: 'Post Immediately',
                            placeholder: 'FALSE',
                            description: 'Enable to post a tweet immediately upon activation.',
                            type: 'boolean'
                        }
                    ]
                },
                search: {
                    name: 'Twitter Search',
                    description: 'Allows searching on the Twitter timeline and auto-responding to relevant tweets as the configured agent.',
                    configGuide: 'Enable this option to search for posts related to the target account and automatically respond in the agent’s style. Ensure the Twitter username and topics are set in the agent configuration.',
                    settings: [
                        {
                            name: 'TWITTER_SEARCH_ENABLE',
                            label: 'Enable Twitter Search',
                            placeholder: 'FALSE',
                            type: 'boolean',
                            description: 'Enable or disable searching on Twitter.'
                        }
                    ]
                },
                share: {
                    name: 'Twitter Share Automation (ReTweet, Quote)',
                    description: 'Automatically retweet, quote, or reply to tweets from targeted users in the agent’s style.',
                    configGuide: 'Enable retweeting, quoting, or replying to tweets from specified users. Set random time intervals between actions to avoid rate limits and customize sharing behavior.',
                    settings: [
                        {
                            name: 'TWITTER_RETWEET_ENABLE',
                            label: 'Twitter Retweet Enable',
                            placeholder: 'TRUE / FALSE',
                            description: 'Enable or disable retweeting tweets from targeted users.',
                            type: 'boolean'
                        },
                        {
                            name: 'TWITTER_QUOTE_ENABLE',
                            label: 'Twitter Quote Enable',
                            placeholder: 'TRUE / FALSE',
                            description: 'Enable or disable quoting tweets with a custom response from the agent.',
                            type: 'boolean'
                        },
                        {
                            name: 'ENABLE_REPLY_WHEN_SHARE',
                            label: 'Enable Reply When Sharing',
                            placeholder: 'TRUE / FALSE',
                            description: 'Enable or disable adding a reply when retweeting or quoting a tweet.',
                            type: 'boolean'
                        },
                        {
                            name: 'SHARE_INTERVAL_MIN',
                            label: 'Minimum Share Interval',
                            placeholder: '120',
                            description: 'Minimum interval (in minutes) for the random delay between sharing actions.',
                            type: 'number'
                        },
                        {
                            name: 'SHARE_INTERVAL_MAX',
                            label: 'Maximum Share Interval',
                            placeholder: '240',
                            description: 'Maximum interval (in minutes) for the random delay between sharing actions.',
                            type: 'number'
                        }
                    ]
                },
                follow: {
                    name: 'Twitter Follow Automation(by Keyword)',
                    description: 'Automatically find the latest tweets related to specific keywords and follow the users who posted them.',
                    configGuide: 'Enable the feature and enter the desired keywords.',
                    settings: [
                        {
                            name: 'ENABLE_FOLLOW_BY_KEYWORD',
                            label: 'Enable Follow by Keyword',
                            placeholder: 'true / false',
                            description: 'Enable or disable following users who posted the latest tweets related to specific keywords.',
                            type: 'boolean',
                        },
                        {
                            name: 'TWITTER_FOLLOW_KEYWORD',
                            label: 'Twitter Follow Keyword',
                            placeholder: 'keyword1, keyword2, ...',
                            description: 'List of keywords used to find the latest tweets and follow the authors.',
                            type: 'text',
                        }
                    ]
                },
                dm:{
                    name: 'Twitter Direct Message',
                    description: 'automatically reply direct messages',
                    configGuide: 'Enable the feature and enter the desired keywords.',
                    settings: [
                        {
                            name: 'ENABLE_TWITTER_DM',
                            label: 'Enable Twitter Direct Message',
                            placeholder: 'true / false',
                            description: 'Enable or disable replying to direct messages.',
                            type: 'boolean',
                        }
                    ]
                }
            }
        }
    }
}

export default socialMediaConfig;
