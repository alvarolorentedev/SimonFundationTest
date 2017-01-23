//----------------- Actions --------------------

var types = {
  ADD_REQUEST: 'ADD_REQUEST',
  CLOSE_REQUEST: 'CLOSE_REQUEST'
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

var closeRequestAction = function(title, author, date){
    return { 
        type: types.CLOSE_REQUEST
    }
}

var ActionCreators = Object.assign({}, {
    addRequest: addRequestAction,
    closeRequest: closeRequestAction
})

//----------------- Reducers --------------------
var initialState = {
    requests: Immutable.List([])
}

var stage = {
    start: 0,
    end: 1
}

var addRequestReducer = function(state = Immutable.List([]), action){
    switch(action.type){
        case types.ADD_REQUEST:
            return state.push({title: action.info.title, author: action.info.author, date: action.info.date, stage: stage.start})
    }
    return state
}

var rootReducer = Redux.combineReducers({
    requests: addRequestReducer
})

//----------------- Coponents --------------------
var mapstateToProps = function(state) {
  return { 
      requests: state.requests.toJS()
  }
}

var mapDispatchToProps = function (dispatch){
    return Redux.bindActionCreators(ActionCreators, dispatch);
}

var requestDef = function(request){
    return React.createElement(
        'div',
        {},
        React.createElement('p', {},'request: ' + request.title + ' ' + request.author + ' ' + request.date),
        React.createElement( 'button', { onClick: function() { that.props.closeRequest() } }, 'Close')
        
        )
}

var appDef = React.createClass({
  render: function () {
    var requestList = []
    this.props.requests.forEach(function(request){
        console
        requestList.push(requestDef(request))
    })
    var that = this
    return React.createElement('div',
    {},
    React.createElement( 'form', {},
    React.createElement( 'Label', { }, 'Title'),
    React.createElement( 'input', { id: 'title' }),
    React.createElement( 'Label', { }, 'Author'),
    React.createElement( 'input', { id: 'author' })),
    React.createElement( 'button', { onClick: function() { that.props.addRequest(this.title.value, this.author.value, new Date()) } }, 'Add Request'),
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