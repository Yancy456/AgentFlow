import { useAtom, useAtomValue } from 'jotai'
import { Box, Grid } from '@mui/material'
import React from 'react'
import * as go from 'gojs'
import { ReactDiagram } from 'gojs-react'

/**
 * Diagram initialization method, which is passed to the ReactDiagram component.
 * This method is responsible for making the diagram and initializing the model and any templates.
 * The model's data should not be set here, as the ReactDiagram component handles that via the other props.
 */
function initDiagram() {
    // set your license key here before creating the diagram: go.Diagram.licenseKey = "...";
    const diagram = new go.Diagram({
        'undoManager.isEnabled': true, // must be set to allow for model change listening
        // 'undoManager.maxHistoryLength': 0,  // uncomment disable undo/redo functionality
        'clickCreatingTool.archetypeNodeData': { text: 'new node', color: 'lightblue' },
        model: new go.GraphLinksModel({
            linkKeyProperty: 'key', // IMPORTANT! must be defined for merges and data sync when using GraphLinksModel
            copiesArrays: true,
            copiesArrayObjects: true,
            linkFromPortIdProperty: 'fromPort',
            linkToPortIdProperty: 'toPort',
        }),
    })

    // This template is a Panel that is used to represent each item in a Panel.itemArray.
    // The Panel is data bound to the item object.
    var fieldTemplate = new go.Panel('TableRow', {
        // this Panel is a row in the containing Table
        background: 'transparent', // so this port's background can be picked by the mouse
        fromSpot: go.Spot.Right, // links only go from the right side to the left side
        toSpot: go.Spot.Left,
        // allow drawing links from or to this port:
        fromLinkable: true,
        toLinkable: true,
    })
        .bind('portId', 'name') // this Panel is a "port"
        .add(
            new go.Shape({
                width: 12,
                height: 12,
                column: 0,
                strokeWidth: 2,
                margin: 4,
                // but disallow drawing links from or to this shape:
                fromLinkable: false,
                toLinkable: false,
            })
                .bind('figure', 'figure')
                .bind('fill', 'color'),
            new go.TextBlock({
                margin: new go.Margin(0, 5),
                column: 1,
                font: 'bold 13px sans-serif',
                alignment: go.Spot.Left,
                // and disallow drawing links from or to this text:
                fromLinkable: false,
                toLinkable: false,
            }).bind('text', 'name'),
            new go.TextBlock({
                margin: new go.Margin(0, 5),
                column: 2,
                font: '13px sans-serif',
                alignment: go.Spot.Left,
            }).bind('text', 'info')
        )

    // This template represents a whole "record".
    diagram.nodeTemplate = new go.Node('Auto', {
        copyable: false,
        deletable: false,
    })
        .bindTwoWay('location', 'loc', go.Point.parse, go.Point.stringify)
        .add(
            // this rectangular shape surrounds the content of the node
            new go.Shape({ fill: '#EEEEEE' }),
            // the content consists of a header and a list of items
            new go.Panel('Vertical')
                // this is the header for the whole node
                .add(
                    new go.Panel('Auto', { stretch: go.Stretch.Horizontal }) // as wide as the whole node
                        .add(
                            new go.Shape({ fill: '#1570A6', stroke: null }),
                            new go.TextBlock({
                                alignment: go.Spot.Center,
                                margin: 3,
                                stroke: 'white',
                                textAlign: 'center',
                                font: 'bold 12pt sans-serif',
                            }).bind('text', 'key')
                        ),
                    //new go.PanelExpanderButton('PANEL', new go.TextBlock('-'), new go.TextBlock('+')),
                    // this Panel holds a Panel for each item object in the itemArray;
                    // each item Panel is defined by the itemTemplate to be a TableRow in this Table
                    new go.Panel('Table', {
                        padding: 2,
                        minSize: new go.Size(100, 10),
                        defaultStretch: go.Stretch.Horizontal,
                        itemTemplate: fieldTemplate,
                    }).bind('itemArray', 'fields')
                ) // end Table Panel of items
        ) // end Vertical Panel

    diagram.linkTemplate = new go.Link({
        relinkableFrom: true,
        relinkableTo: true, // let user reconnect links
        toShortLength: 4,
        fromShortLength: 2,
    }).add(new go.Shape({ strokeWidth: 1.5 }), new go.Shape({ toArrow: 'Standard', stroke: null }))

    return diagram
}

/**
 * This function handles any changes to the GoJS model.
 * It is here that you would make any updates to your React state, which is discussed below.
 */
function handleModelChange(changes) {
    //alert('GoJS model changed!');
}

export default function Main() {
    return (
        <Box className="bg-white ">
            <ReactDiagram
                initDiagram={initDiagram}
                divClassName="diagram-component"
                style={{
                    width: '500px',
                    height: '500px',
                    background: 'white',
                    border: 'solid 1px black',
                }}
                nodeDataArray={[
                    {
                        key: 'Record1',
                        fields: [
                            { name: 'field1', info: '', color: '#F7B84B', figure: 'Ellipse' },
                            { name: 'field2', info: 'the second one', color: '#F25022', figure: 'Ellipse' },
                            { name: 'fieldThree', info: '3rd', color: '#00BCF2' },
                        ],
                        loc: '0 0',
                    },
                    {
                        key: 'Record2',
                        fields: [
                            { name: 'fieldA', info: '', color: '#FFB900', figure: 'Diamond' },
                            { name: 'fieldB', info: '', color: '#F25022', figure: 'Rectangle' },
                            { name: 'fieldC', info: '', color: '#7FBA00', figure: 'Diamond' },
                            { name: 'fieldD', info: 'fourth', color: '#00BCF2', figure: 'Rectangle' },
                        ],
                        loc: '280 0',
                    },
                ]}
                linkDataArray={[
                    { from: 'Record1', fromPort: 'field1', to: 'Record2', toPort: 'fieldA' },
                    { from: 'Record1', fromPort: 'field2', to: 'Record2', toPort: 'fieldD' },
                    { from: 'Record1', fromPort: 'fieldThree', to: 'Record2', toPort: 'fieldB' },
                ]}
                onModelChange={handleModelChange}
            />
        </Box>
    )
}
