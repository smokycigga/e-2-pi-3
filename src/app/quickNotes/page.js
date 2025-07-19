'use client';
import React, { useState } from 'react';
import { useAuth } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import Sidebar from '../components/sidebar';


const quickNotesData = [
  {
    id: 309,
    title: 'Important Notes - Physics',
    description: 'Key equations and formulas for physics',
    subject: 'Physics',
    topic: 'Mechanics',
    type: 'Formula Sheet',
    content: 'This would contain all important mechanics formulas.',
    link: 'https://drive.google.com/file/d/1xnCHu_sJUmwDcFWnGl7SGurePkrn-x0O/view'
  },
  {
    id: 307,
    title: 'Important Reactions - Chemistry',
    description: 'Summary of important reactions in chemistry',
    subject: 'Chemistry',
    topic: 'Organic Chemistry',
    type: 'Summary',
    content: 'This would contain all important chemistry reactions.'
  },
  {
    id: 308,
    title: 'Calculus Derivatives',
    description: 'Essential derivative formulas and rules',
    subject: 'Mathematics',
    topic: 'Calculus',
    type: 'Formula Sheet',
    content: 'Complete guide to derivative calculations and applications.'
  },
  {
    id: 310,
    title: 'Organic Reactions Map',
    description: 'Visual guide to organic chemistry reactions',
    subject: 'Chemistry',
    topic: 'Organic Chemistry',
    type: 'Concept Map',
    content: 'Interactive map showing reaction pathways and mechanisms.'
  },
  {
    id: 311,
    title: 'Physics Problem Tips',
    description: 'Strategy guide for solving physics problems',
    subject: 'Physics',
    topic: 'Problem Solving',
    type: 'Tips & Tricks',
    content: 'Step-by-step approach to tackle complex physics problems.'
  }
];

const subjects = ['All', 'Physics', 'Chemistry', 'Mathematics'];
const noteTypes = ['All', 'Formula Sheet', 'Summary', 'Concept Map', 'Tips & Tricks'];

const Notes = () => {
  const { isLoaded, userId } = useAuth();
  const router = useRouter();

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  if (!userId) {
    router.push('/login');
    return <div>Redirecting to login...</div>;
  }
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('All');
  const [selectedType, setSelectedType] = useState('All');
  const [activeTab, setActiveTab] = useState('all');
  const [favorites, setFavorites] = useState([]);
  const [previewLink, setPreviewLink] = useState(null);

  const filteredNotes = quickNotesData.filter(note => {
    const matchesSearch =
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.topic.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSubject = selectedSubject === 'All' || note.subject === selectedSubject;
    const matchesType = selectedType === 'All' || note.type === selectedType;
    return matchesSearch && matchesSubject && matchesType;
  });

  const toggleFavorite = (noteId) => {
    setFavorites(prev =>
      prev.includes(noteId)
        ? prev.filter(id => id !== noteId)
        : [...prev, noteId]
    );
  };

  const getTabNotes = () => {
    switch (activeTab) {
      case 'formulas':
        return filteredNotes.filter(note => note.type === 'Formula Sheet');
      case 'summaries':
        return filteredNotes.filter(note => note.type === 'Summary');
      case 'favorites':
        return filteredNotes.filter(note => favorites.includes(note.id));
      default:
        return filteredNotes;
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />
      <div className="flex-1 ml-64 p-8 overflow-y-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-3">Quick Notes</h1>
          <p className="text-muted-foreground text-lg">Fast reference for key concepts and formulas</p>
        </header>

        <main>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8">
            <input
              type="text"
              placeholder="Search notes..."
              className="bg-background text-foreground border-2 border-input rounded-2xl px-6 py-3 w-full md:w-1/3 focus:ring-4 focus:ring-ring focus:border-primary transition-all duration-300 shadow-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <div className="flex gap-4">
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="bg-background text-foreground border-2 border-input rounded-2xl px-6 py-3 focus:ring-4 focus:ring-ring focus:border-primary transition-all duration-300 shadow-sm"
              >
                {subjects.map(subject => <option key={subject}>{subject}</option>)}
              </select>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="bg-background text-foreground border-2 border-input rounded-2xl px-6 py-3 focus:ring-4 focus:ring-ring focus:border-primary transition-all duration-300 shadow-sm"
              >
                {noteTypes.map(type => <option key={type}>{type}</option>)}
              </select>
            </div>
          </div>

          <div className="mb-8">
            <nav className="flex space-x-6 border-b-2 border-border pb-2">
              {[
                { id: 'all', label: 'All Notes' },
                { id: 'formulas', label: 'Formula Sheets' },
                { id: 'summaries', label: 'Summaries' },
                { id: 'favorites', label: 'Favorites' },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-3 px-6 rounded-2xl transition-all duration-300 font-medium ${activeTab === tab.id
                    ? 'bg-primary text-primary-foreground shadow-lg'
                    : 'text-muted-foreground hover:text-primary hover:bg-accent'
                    }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {getTabNotes().map(note => (
              <div
                key={note.id}
                className="bg-card rounded-3xl shadow-lg p-6 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-border"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-card-foreground mb-2">{note.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{note.description}</p>
                  </div>
                  <button
                    onClick={() => toggleFavorite(note.id)}
                    className={`ml-3 text-2xl transition-all duration-300 hover:scale-110 ${favorites.includes(note.id)
                      ? 'text-primary drop-shadow-lg'
                      : 'text-muted hover:text-primary'
                      }`}
                    aria-label="Toggle Favorite"
                  >
                    {favorites.includes(note.id) ? '★' : '☆'}
                  </button>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center">
                    <span className="font-semibold text-primary min-w-[70px]">Subject:</span>
                    <span className="text-card-foreground">{note.subject}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="font-semibold text-primary min-w-[70px]">Topic:</span>
                    <span className="text-card-foreground">{note.topic}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="font-semibold text-primary min-w-[70px]">Type:</span>
                    <span className="inline-block bg-accent text-accent-foreground px-3 py-1 rounded-full text-sm font-medium">
                      {note.type}
                    </span>
                  </div>
                </div>

                <p className="text-muted-foreground text-sm leading-relaxed mb-4 bg-muted p-3 rounded-2xl">
                  {note.content}
                </p>

                {note.link && (
                  <button
                    onClick={() => setPreviewLink(note.link)}
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 rounded-2xl transition-all duration-300 font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    Preview Document
                  </button>
                )}
              </div>
            ))}
          </div>

          {getTabNotes().length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📚</div>
              <h3 className="text-2xl font-bold text-muted-foreground mb-2">No notes found</h3>
              <p className="text-muted-foreground">Try adjusting your search or filters</p>
            </div>
          )}
        </main>

        {previewLink && (
          <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-card rounded-3xl shadow-2xl overflow-hidden w-full max-w-6xl h-5/6 relative">
              <div className="bg-primary p-4 flex items-center justify-between">
                <h3 className="text-primary-foreground font-bold text-lg">Document Preview</h3>
                <button
                  onClick={() => setPreviewLink(null)}
                  className="text-primary-foreground hover:text-accent-foreground text-3xl font-bold transition-colors duration-300 hover:scale-110 transform"
                >
                  ×
                </button>
              </div>
              <iframe
                src={previewLink}
                title="Preview"
                className="w-full h-full"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notes;