import React from 'react'
import { useReactTable } from '@tanstack/react-table';

const columns =[
    {
        ''
    }
];

const TestsTable = ({data}) => {
    const table = useReactTable({
        data: data,
        columns
    });
    return (
        <div>TestsTable</div>
    );
}

export default TestsTable