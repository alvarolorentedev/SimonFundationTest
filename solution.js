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

var closeRequestAction = function(id){
    return { 
        type: types.CLOSE_REQUEST,
        info: {
            id: id
        }
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
            return state.push(Immutable.Map({title: action.info.title, author: action.info.author, date: action.info.date, id: state.size , stage: stage.start}))
        case types.CLOSE_REQUEST:
            var index = state.findIndex(function(element) {
                return element.get('id') === action.info.id
            })
            console.log(index)
            return state.setIn([index, 'stage'], stage.end)
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

var requestDef = function(props, request){
    var button = undefined
    if(request.stage == stage.start)
        button = React.createElement( 'button', { onClick: function() { props.closeRequest(request.id) } }, 'Close')
    return React.createElement(
        'div',
        {},
        React.createElement('p', {},'request: ' + request.title + ' ' + request.author + ' ' + request.date),
        button
        )
}

var appDef = React.createClass({
  render: function () {
    var requestList = []
    var that = this
    this.props.requests.forEach(function(request){
        requestList.push(requestDef(that.props, request))
    })
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