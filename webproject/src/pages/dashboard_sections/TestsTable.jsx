import React from 'react'
import { flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';

const columns = [
    {
        'accessorKey': "title",
        header: "Test",
        cell: (props) => <p>{props.getValue()}</p>
    },
    {
        'accessorKey': "test_type",
        header: "Type",
        cell: (props) => <p>{props.getValue()}</p>
    },
    {
        'accessorKey': "description",
        header: "Description",
        cell: (props) => <p>{props.getValue()}</p>
    },
    {
        'accessorKey': "questions",
        header: "Questions",
        cell: (props) => <p>{props.getValue().length}</p>
    },
];

const TestsTable = ({data}) => {
    const table = useReactTable({
        data: data,
        columns,
        getCoreRowModel: getCoreRowModel()
    });
    return (
        <div>
            <table style={{width: `${table.getTotalSize()}px`}}>
                <thead>
                    {data && data.length>0 && table.getHeaderGroups().map(headerGroup=>(
                        <tr key={headerGroup.id}>
                            {headerGroup.headers.map(header=>(
                                <th key={header.id} style={{width: `${header.getSize()}px`}}>
                                    {header.column.columnDef.header}
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody>
                    {table.getRowModel().rows.length>0 && 
                        table.getRowModel().rows.map(row=>(
                            <tr key={row.id}>
                                {row.getVisibleCells().map(cell=>{
                                    return <td key={cell.id} style={{width: `${cell.column.getSize()}px`}}>
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </td>
                                })}
                            </tr>
                        ))
                    }
                </tbody>
            </table>
        </div>
    );
}

export default TestsTable