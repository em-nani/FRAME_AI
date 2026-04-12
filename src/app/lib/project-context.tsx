import React, { createContext, useContext, useState, useCallback } from 'react';
import { Project } from './types';

interface ProjectContextType {
  projects: Project[];
  currentProject: Project | null;
  addProject: (project: Project) => void;
  updateProject: (projectId: string, updates: Partial<Project>) => void;
  deleteProject: (projectId: string) => void;
  setCurrentProject: (projectId: string | null) => void;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export function ProjectProvider({ children }: { children: React.ReactNode }) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentProjectId, setCurrentProjectId] = useState<string | null>(null);

  const addProject = useCallback((project: Project) => {
    setProjects(prev => [...prev, project]);
    setCurrentProjectId(project.id);
  }, []);

  const updateProject = useCallback((projectId: string, updates: Partial<Project>) => {
    setProjects(prev =>
      prev.map(p => (p.id === projectId ? { ...p, ...updates } : p))
    );
  }, []);

  const deleteProject = useCallback((projectId: string) => {
    setProjects(prev => prev.filter(p => p.id !== projectId));
    if (currentProjectId === projectId) {
      setCurrentProjectId(null);
    }
  }, [currentProjectId]);

  const setCurrentProject = useCallback((projectId: string | null) => {
    setCurrentProjectId(projectId);
  }, []);

  const currentProject = projects.find(p => p.id === currentProjectId) || null;

  return (
    <ProjectContext.Provider
      value={{
        projects,
        currentProject,
        addProject,
        updateProject,
        deleteProject,
        setCurrentProject,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
}

export function useProjects() {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProjects must be used within ProjectProvider');
  }
  return context;
}
