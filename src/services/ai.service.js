// services/ai.service.js
import axios from 'axios';
import config from '../config/environment.js';
import logger from '../utils/logger.js';

class AIService {
    constructor() {
        // Grok AI endpoint (xAI API)
        this.apiUrl = config.GROK_API_URL || 'https://api.x.ai/v1';
        this.apiKey = config.GROK_API_KEY;

        if (!this.apiKey) {
            logger.warn('GROK_API_KEY not set. AI features will be disabled.');
        }
    }

    /**
     * Generate a weekly schedule using Grok AI
     * @param {Object} params - Schedule parameters
     * @returns {Promise<Object>} Generated schedule
     */
    async generateSchedule(params) {
        const { teachers, subjects, classes, constraints } = params;

        const prompt = this._buildSchedulePrompt(teachers, subjects, classes, constraints);

        try {
            const response = await axios.post(
                `${this.apiUrl}/chat/completions`,
                {
                    model: 'grok-beta',
                    messages: [
                        {
                            role: 'system',
                            content: 'You are an expert educational schedule planner. Generate conflict-free, optimized schedules in JSON format.'
                        },
                        {
                            role: 'user',
                            content: prompt
                        }
                    ],
                    temperature: 0.3, // Lower temperature for more deterministic output
                    response_format: { type: 'json_object' }
                },
                {
                    headers: {
                        'Authorization': `Bearer ${this.apiKey}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            const scheduleData = JSON.parse(response.data.choices[0].message.content);
            return {
                success: true,
                schedule: scheduleData
            };
        } catch (error) {
            logger.error('Grok AI schedule generation failed:', error.message);
            return {
                success: false,
                error: error.message,
                fallback: this._generateFallbackSchedule(teachers, subjects, classes)
            };
        }
    }

    /**
     * Suggest a substitute teacher using AI
     * @param {Object} params - Substitution parameters
     * @returns {Promise<Object>} Suggested substitute
     */
    async suggestSubstitute(params) {
        const { absentTeacherId, subject, timeSlot, availableTeachers } = params;

        const prompt = `
Given the following scenario:
- Subject: ${subject}
- Time Slot: ${timeSlot}
- Available Teachers: ${JSON.stringify(availableTeachers, null, 2)}

Select the BEST substitute teacher based on:
1. Subject expertise (highest priority)
2. Current workload (prefer less loaded teachers)
3. Past substitution history

Respond in JSON format:
{
  "recommendedTeacherId": "teacher_id",
  "reason": "explanation",
  "alternativeOptions": ["teacher_id_2", "teacher_id_3"]
}
`;

        try {
            const response = await axios.post(
                `${this.apiUrl}/chat/completions`,
                {
                    model: 'grok-beta',
                    messages: [
                        {
                            role: 'system',
                            content: 'You are an AI assistant for educational administration. Provide optimal teacher substitution recommendations.'
                        },
                        {
                            role: 'user',
                            content: prompt
                        }
                    ],
                    temperature: 0.2,
                    response_format: { type: 'json_object' }
                },
                {
                    headers: {
                        'Authorization': `Bearer ${this.apiKey}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            const suggestion = JSON.parse(response.data.choices[0].message.content);
            return {
                success: true,
                ...suggestion
            };
        } catch (error) {
            logger.error('Grok AI substitution suggestion failed:', error.message);
            // Fallback: Simple algorithm
            return this._fallbackSubstituteSelection(availableTeachers, subject);
        }
    }

    /**
     * Build the schedule generation prompt
     * @private
     */
    _buildSchedulePrompt(teachers, subjects, classes, constraints) {
        return `
Generate a weekly class schedule with the following parameters:

**Teachers:**
${JSON.stringify(teachers, null, 2)}

**Subjects:**
${JSON.stringify(subjects, null, 2)}

**Classes/Sections:**
${JSON.stringify(classes, null, 2)}

**Constraints:**
${JSON.stringify(constraints, null, 2)}

**Requirements:**
1. No teacher should have overlapping classes
2. Each class should have balanced distribution of subjects
3. Respect teacher availability constraints
4. Avoid scheduling heavy subjects (Math, Science) consecutively
5. Include break times

**Output Format (JSON):**
{
  "schedule": [
    {
      "day": "Monday",
      "timeSlot": "09:00-10:00",
      "subject": "Mathematics",
      "teacherId": "teacher_id",
      "section": "CS-A",
      "room": "Room 201"
    },
    ...
  ],
  "conflicts": [],
  "notes": "Any important notes about the schedule"
}
`;
    }

    /**
     * Fallback schedule generation (rule-based)
     * @private
     */
    _generateFallbackSchedule(teachers, subjects, classes) {
        logger.info('Using fallback schedule generation');

        const schedule = [];
        const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
        const timeSlots = [
            '09:00-10:00',
            '10:00-11:00',
            '11:30-12:30', // After break
            '12:30-01:30',
            '02:00-03:00'
        ];

        // Simple round-robin assignment
        let subjectIndex = 0;
        let teacherIndex = 0;

        for (const day of days) {
            for (const timeSlot of timeSlots) {
                for (const classSection of classes) {
                    const subject = subjects[subjectIndex % subjects.length];
                    const teacher = teachers[teacherIndex % teachers.length];

                    schedule.push({
                        day,
                        timeSlot,
                        subject: subject.name,
                        teacherId: teacher._id,
                        section: classSection.name,
                        room: `Room ${Math.floor(Math.random() * 300) + 100}`
                    });

                    subjectIndex++;
                    teacherIndex++;
                }
            }
        }

        return {
            schedule,
            conflicts: [],
            notes: 'Generated using fallback algorithm (Grok AI unavailable)'
        };
    }

    /**
     * Fallback substitute selection
     * @private
     */
    _fallbackSubstituteSelection(availableTeachers, subject) {
        // Simple heuristic: Pick first teacher with matching subject expertise
        const match = availableTeachers.find(t =>
            t.subjects && t.subjects.includes(subject)
        );

        return {
            success: true,
            recommendedTeacherId: match ? match._id : availableTeachers[0]?._id,
            reason: match
                ? 'Selected based on subject expertise'
                : 'Selected first available teacher (no subject match)',
            alternativeOptions: availableTeachers.slice(1, 3).map(t => t._id)
        };
    }
}

export default new AIService();
