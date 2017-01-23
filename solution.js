//----------------- Actions --------------------

var types = {
  ADD_REQUEST: 'ADD_REQUEST',
  CLOSE_REQUEST: 'CLOSE_REQUEST',
  MODIFY_REQUEST: 'MODIFY_REQUEST',
  FILTER_REQUEST: 'FILTER_REQUEST',
}

var addRequestAction = function(title, author, date){
    return { 
        type: types.ADD_REQUEST,
        info: {
            title: title,
            author: author,
            date: date
        }
    }
}

var modifyRequestAction = function(id,title, author, date){
    return { 
        type: types.MODIFY_REQUEST,
        info: {
            id: id,
            title: title,
            author: author,
            date: date
        }
    }
}

var closeRequestAction = function(id){
    return { 
        type: types.CLOSE_REQUEST,
        info: {
            id: id
        }
    }
}

var filterAction = function(filter){
    return { 
        type: types.FILTER_REQUEST,
        info: {
            filter: filter
        }
    }
}

var ActionCreators = Object.assign({}, {
    addRequest: addRequestAction,
    closeRequest: closeRequestAction,
    saveRequest: modifyRequestAction,
    filter: filterAction
})

//----------------- Reducers --------------------
var stage = {
    start: 0,
    end: 1
}

var initialState = {
    requests: Immutable.List([]),
    stage: Immutable.Map({stage: stage.start})
}

var addRequestReducer = function(state = Immutable.List([]), action){
    switch(action.type){
        case types.ADD_REQUEST:
            return state.push(Immutable.Map({title: action.info.title, author: action.info.author, date: action.info.date, id: state.size , stage: stage.start}))
        case types.CLOSE_REQUEST:
            var index = state.findIndex(function(element) {
                return element.get('id') === action.info.id
            })
            return state.setIn([index, 'stage'], stage.end)
        case types.MODIFY_REQUEST:
            var index = state.findIndex(function(element) {
                return element.get('id') === action.info.id
            })
            return state.setIn([index, 'title'], action.info.title).setIn([index, 'author'], action.info.author).setIn([index, 'date'], action.info.date)
    }
    return state
}

var filterReducer = function(state = Immutable.Map({stage: stage.start}), action){
    switch(action.type){
        case types.FILTER_REQUEST:
            return state.merge(action.info.filter)
    }
    return state
}


var rootReducer = Redux.combineReducers({
    requests: addRequestReducer,
    filter: filterReducer
})

//----------------- Coponents --------------------
var displayFilter = function(requests, filters){
    return requests.filter(function(request) {
        return Object.keys(filters).every(function(property) {
            console.log(property + ' ' + filters[property])
            if(filters[property] === '')
                return true
            return request[property] === filters[property]
            
        })
  })
}


var mapstateToProps = function(state) {
    var filters = state.filter.toJS()
    return { 
        requests: displayFilter(state.requests.toJS(),filters),
        visibleStage: filters.stage
    }
}

var mapDispatchToProps = function (dispatch){
    return Redux.bindActionCreators(ActionCreators, dispatch);
}

var requestDef = function(props, request){
    var button = undefined
    if(request.stage == stage.start)
        button = React.createElement( 'button', { onClick: function() { props.closeRequest(request.id) } }, 'Close')
    return React.createElement(
        'div',
        {},
            React.createElement( 'form', {},
            React.createElement( 'Label', { }, 'Title'),
            React.createElement( 'input', { key: request.id+'title', id: request.id+'title', defaultValue: request.title}),
            React.createElement( 'Label', { }, 'Author'),
            React.createElement( 'input', { key: request.id+'author', id: request.id+'author', defaultValue: request.author }),
            React.createElement( 'Label', { }, 'Date'),
            React.createElement( 'input', { key: request.id+'date', id: request.id+'date', defaultValue: request.date })),
            button,
            React.createElement( 'button', { onClick: function() { props.saveRequest(request.id, this[request.id+'title'].value, this[request.id+'author'].value, this[request.id+'date'].value ) } }, 'Save')
        )
}

var appDef = React.createClass({
  render: function () {
    var requestList = []
    var addForm = undefined
    var that = this
    this.props.requests.forEach(function(request){
            requestList.push(requestDef(that.props, request))
    })
    if(this.props.visibleStage == stage.start)
        addForm = React.createElement('div', { },
            React.createElement( 'form', {},
            React.createElement( 'Label', { }, 'Title'),
            React.createElement( 'input', { id: 'title' }),
            React.createElement( 'Label', { }, 'Author'),
            React.createElement( 'input', { id: 'author' })),
            React.createElement( 'button', { onClick: function() { that.props.addRequest(this.title.value, this.author.value, new Date()) } }, 'Add Request')
        )
    return React.createElement('div',
        {},
        React.createElement( 'Select', 
            { id: 'stageVisible', onChange: function(){ that.props.filter({stage: this.stageVisible.selectedIndex}) }}, 
            React.createElement('option', {},'start'),
            React.createElement('option', {},'end')
        ),
        React.createElement('div', { },
            React.createElement( 'form', {},
            React.createElement( 'Label', { }, 'Title'),
            React.createElement( 'input', { id: 'titleFilter' }),
            React.createElement( 'Label', { }, 'Author'),
            React.createElement( 'input', { id: 'authorFilter' })),
            React.createElement( 'button', { onClick: function() { that.props.filter({title: this.titleFilter.value, author: this.authorFilter.value}) } }, 'Filter Requests'),
            React.createElement( 'button', { onClick: function() { that.props.filter({title: '', author: ''}) } }, 'Clear Filter')
        ),
        addForm,
        requestList
    )
  }
})

var app = ReactRedux.connect(mapstateToProps,mapDispatchToProps)(appDef)

//----------------- app setup --------------------

var enhancer = Redux.compose(Redux.applyMiddleware(reduxLogger()))

var store = Redux.createStore(rootReducer, initialState, enhancer);

ReactDOM.render(
  React.createElement( ReactRedux.Provider, { store: store }, React.createElement(app)),
  document.getElementById('app')
)