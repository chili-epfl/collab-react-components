/**
 * Created by dario on 11.05.17.
 */

const Express = require('express');
const CollabServer = require('../../dist').Server;
const CollabCollection = require('../../dist').Collection;

/* Create Express application */
const app = Express();
// Express only serves static assets in production
if (process.env.NODE_ENV === 'production') {
  app.use(Express.static('client/build'));
}

// Create a CollabServer instance
CollabServer.start(app);

// Create the collection that will hold the shared data.
const forms = new CollabCollection('forms');

// Define the schema of the data
const schema = {
    title: 'Bubble sort algorithm',
    type: 'object',
    properties: {
        principle: {
            'type': 'string',
            'title': 'principle',
            'description': 'Explain in one line the principle of bubble sort'
        },
        complexity: {
            'type': 'string',
            'title': 'Complexity',
            'description': 'What are the worst case and best case time complexity of bubble sort consequently?',
            'enum': [
                'O(n), O(n2)',
                'O(n2), O(n3)',
                'O(1), O(n)',
                'None of the above'
            ]
        },
        comparisons: {
            'type': 'integer',
            'title': 'Comparisons',
            'description': 'What is the maximum number of comparisons if there are 5 elements in array x?',
            'enum': [
                10, 2, 5, 25
            ],
        },
        performance: {
            'type': 'string',
            'title': 'Performance',
            'description': 'Explain why the bubble sort algorithm has a worst complexity than other sort algorithms'
        },
    }
};

const schema2 = {
    title: 'Quick sort algorithm',
    type: 'object',
    properties: {
        color: {
            'type': 'string',
            'title': 'Color',
            'description': 'What color is quick sort?',
            'default': '#151ce6'
        },
        complexity: {
            'type': 'string',
            'title': 'Complexity',
            'description': 'What are the worst case and best case time complexity of quick sort consequently?',
        },
        pivot: {
            'type': 'integer',
            'title': 'pivot',
            'description': 'In this sequence, 11 4 20 45 32 60 98 70, which element seems to be the pivot?',
        },
        performance: {
            'type': 'string',
            'title': 'Performance',
            'description': 'Explain why the quick sort algorithm has a good complexity'
        },
    }
};

// Create the shared form data
forms.createForm('form1', schema, function(err) {
    throw err;
});
forms.createForm('form2', schema2, function(err) {
    throw err;
});