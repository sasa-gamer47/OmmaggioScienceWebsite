export const subjects = [
    {
        name: 'Chemistry',
        icon: '🧪',
    },
    {
        name: 'Coding',
        icon: '💻',
    },
    {
        name: 'Math',
        icon: '🧮',
    },
    {
        name: 'Biology',
        icon: '🧬',
    },
    {
        name: 'Anatomy',
        icon: '👨🏻‍⚕️',
    },
]

export const categories = [
    {
        name: 'Medicine',
        icon: '💊',
        subjects: ['math', 'biology', 'chemistry', 'anatomy'],
    },
    {
        name: 'Web Developing',
        icon: '🖥️',
        subjects: ['coding'],
    },
    {
        name: 'Science',
        icon: '🔬',
        subjects: ['math', 'biology', 'chemistry'],
    }
]

export function getSubjectIcon(subject: string) {
    const sub = subjects.find(s => s.name === subject);
    return subject ? sub?.icon : 'Subject not found';
}