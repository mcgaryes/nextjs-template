'use server';

async function delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

function randomUserName() {
    const names = ['Alice', 'Bob', 'Charlie', 'David', 'Eve'];
    return names[Math.floor(Math.random() * names.length)];
}

function randomUserDescription() {
    const descriptions = [
        'is a software developer with 5 years of experience in web development.',
        'loves hiking and outdoor adventures.',
        'is a passionate photographer and traveler.',
        'enjoys cooking and trying new recipes.',
        'is an avid reader and writer.',
    ];
    return descriptions[Math.floor(Math.random() * descriptions.length)];
}

function userEmailFromName(name: string) {
    return `${name.toLowerCase()}@example.com`;
}

export async function getUserProfileInformation(userId: string) {

    await delay(Math.random() * 5000); // Simulate network delay

    const userName = randomUserName();
    const userDescription = randomUserDescription();
    const userEmail = userEmailFromName(userName);

    return {
        id: `user-${userName.toLowerCase()}`,
        name: userName,
        email: userEmail,
        description: userDescription,
    };
}
