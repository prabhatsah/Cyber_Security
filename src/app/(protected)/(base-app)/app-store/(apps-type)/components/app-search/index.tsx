'use client'
import React, { useContext } from 'react'
import { AppContext } from '../app-context';
import SearchInput from '@/ikon/components/search-input/index';

export default function AppSearchByName() {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('AppSearchByName must be used within a AppProvider');
    }
    const { searchQuery, setSearchQuery } = context;
    return (
        <>
            <SearchInput placeholder="Enter App Name" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value.toLowerCase())} />
        </>
    )
}
