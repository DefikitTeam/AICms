export interface CreateAgentData {
	config: {
		name: string;
		plugins: string[];
		clients: string[];
		clientConfig?: {
			telegram: {
				shouldIgnoreBotMessages: boolean;
				shouldIgnoreDirectMessages: boolean;
				shouldRespondOnlyToMentions: boolean;
				shouldOnlyJoinInAllowedGroups: boolean;
				allowedGroupIds: number[];
				isPartOfTeam: boolean;
				teamAgentIds: number[];
				teamLeaderId: number;
				teamMemberInterestKeywords: [];
			};
			discord: {
				shouldIgnoreBotMessages: boolean;
				shouldIgnoreDirectMessages: boolean;
				shouldRespondOnlyToMentions: boolean;
				isPartOfTeam: boolean;
				teamAgentIds: number[];
				teamLeaderId: number;
				teamMemberInterestKeywords: [];
			};
		};
		modelProvider: string;
		settings: {
			secrets: {
				[key: string]: string | boolean | number;
			};
			voice: {
				model: string;
			};
			imageSettings: {
				steps: number;
				width: number;
				height: number;
			};
		};
		system: string;
		bio: string[];
		lore: string[];
		messageExamples: any[];
		postExamples: string[];
		adjectives: string[];
		people: string[];
		topics: string[];
		style: {
			all: string[];
			chat: string[];
			post: string[];
		};
	};
}

export interface UpdateAgentData {
	name: string;
	plugins: string[];
	clients: string[];
	clientConfig?: {
		telegram: {
			shouldIgnoreBotMessages: boolean;
			shouldIgnoreDirectMessages: boolean;
			shouldRespondOnlyToMentions: boolean;
			shouldOnlyJoinInAllowedGroups: boolean;
			allowedGroupIds: number[];
			isPartOfTeam: boolean;
			teamAgentIds: number[];
			teamLeaderId: number;
			teamMemberInterestKeywords: [];
		};
		discord: {
			shouldIgnoreBotMessages: boolean;
			shouldIgnoreDirectMessages: boolean;
			shouldRespondOnlyToMentions: boolean;
			isPartOfTeam: boolean;
			teamAgentIds: number[];
			teamLeaderId: number;
			teamMemberInterestKeywords: [];
		};
	};
	modelProvider: string;
	settings: {
		secrets: {
			[key: string]: string | boolean | number;
		};
		voice: {
			model: string;
		};
		imageSettings: {
			steps: number;
			width: number;
			height: number;
		};
	};
	system: string;
	bio: string[];
	lore: string[];
	messageExamples: any[];
	postExamples: string[];
	adjectives: string[];
	people: string[];
	topics: string[];
	style: {
		all: string[];
		chat: string[];
		post: string[];
	};
}

export type messageExamples = [
  {
    user: string;
    content: {
      text: string;
    };
  },
  {
    user: string;
    content: {
      text: string;
    };
  },
];
