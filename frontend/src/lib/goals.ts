import axios from 'axios';
import { getSession } from 'next-auth/react';

interface Milestone {
    _id?: string;
    title: string;
    description: string;
    deadline: Date;
    completed: boolean;
    completionDate?: Date;
  }
  
  interface Goal {
    _id?: string;
    user?: string;
    title: string;
    description: string;
    reason: string;
    deadline: Date;
    priority: 'High' | 'Medium' | 'Low';
    category: string;
    status?: 'Not Started' | 'In Progress' | 'Completed';
    milestones: Milestone[];
    progress: number;
    createdAt?: Date;
    updatedAt?: Date;
  }
  
  interface GoalUpdateData {
    title?: string;
    description?: string;
    reason?: string;
    deadline?: Date;
    priority?: 'High' | 'Medium' | 'Low';
    category?: string;
    status?: 'Not Started' | 'In Progress' | 'Completed';
  }
  
  interface MilestoneUpdateData {
    title?: string;
    description?: string;
    deadline?: Date;
    completed?: boolean;
  }

// Create an axios instance configured for your API base URL for goals
const api = axios.create({
  baseURL: 'http://localhost:8000/api/goals',
  headers: {
    'Content-Type': 'application/json',
  }
});

// Interceptor to add the JWT token from NextAuth.js session
api.interceptors.request.use(async (config) => {
    const session:any = await getSession();
    if (session?.accessToken) {
        config.headers.authorization = `Bearer ${session.accessToken}`;
    } else {
        console.log("No access token found in session.");
    }

    return config;
}, error => {
    return Promise.reject(error);
});

// Fetch all goals for a specific user
export const getAllGoals = async (): Promise<Goal[]> => {
  return api.get('/').then(response => response.data);
};

// Create a new goal 
export const createGoal = async (goalData: Goal): Promise<Goal> => {
    try {
        const response = await api.post('/', goalData);
        console.log('Goal created successfully:', response.data);
        return response.data;  // Return only the response data containing the goal
    } catch (error: any) {
        console.error('Error creating goal:', error.response ? error.response.data : error.message);
        throw error;  // Re-throw the error for handling in the calling function
    }
};

// Update a specific goal
export const updateGoal = async (goalId: string, updateData: GoalUpdateData): Promise<Goal> => {
  return api.put(`/${goalId}`, updateData).then(response => response.data);
};

// Delete a specific goal
export const deleteGoal = async (goalId: string): Promise<void> => {
  return api.delete(`/${goalId}`).then(response => response.data);
};

// Complete a goal by setting its status to 'Completed'
export const completeGoal = async (goalId: string): Promise<Goal> => {
  return api.put(`/${goalId}/complete`).then(response => response.data);
};

// Update goal categories
export const updateCategory = async (goalId: string, category: string): Promise<Goal> => {
    return api.patch(`/${goalId}/category`, { category }).then(response => response.data);
};

// Get the history of changes made to a goal
export const getGoalHistory = async (goalId: string): Promise<any[]> => {
  return api.get(`/${goalId}/history`).then(response => response.data);
};

// Get the milestones from a Goal
export const getGoalMilestones = async (goalId: string): Promise<any[]> => {
    return api.get(`/${goalId}/milestones`).then(response => response.data);
};

// API method to update a specific milestone within a goal
export const updateMilestone = async (goalId: string, milestoneId: string, updateData: MilestoneUpdateData): Promise<Milestone> => {
  return api.patch(`/${goalId}/milestones/${milestoneId}`, updateData).then(response => response.data);
};

// API method to delete a specific milestone from a goal
export const deleteMilestone = async (goalId: string, milestoneId: string): Promise<void> => {
  return api.delete(`/${goalId}/milestones/${milestoneId}`).then(response => response.data);
};

// API method to mark a specific milestone as completed
export const completeMilestone = async (goalId: string, milestoneId: string): Promise<Milestone> => {
  return api.patch(`/${goalId}/milestones/${milestoneId}/complete`).then(response => response.data);
};
