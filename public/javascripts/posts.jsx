"use strict";

setTimeout(function(){$('code').wrap("<pre></pre>") }, 500);
var Page = React.createClass({
  displayName: "Page",
  getInitialState: function getInitialState() {
     return {
        user: {},
        post: {},
        post_author:{},
        categories: [],
        comments: [],
        editorValue: '',
     };
  },
  componentWillMount: function componentWillMount() {
    var uri = window.location.pathname; // current page uri (something like `/hello/test`)
    $.getJSON(uri).then((function(res){
      this.setState({
        post: res.post,
        post_author: res.post_author,
        comments: res.comments,
        categories: res.categories,
      });
      console.log(this.state.post)
    }).bind(this));
    $.getJSON('/account').then((function(user){
      this.setState({user: user.user});
      console.log(this.state.user)
    }).bind(this));
  },
  componentDidMount: function componentDidMount(){
    setTimeout(function(){var simplemde = new SimpleMDE({
      element: document.getElementById("body"),
      renderingConfig: {
        singleLineBreaks: false,
        codeSyntaxHighlighting: true,
        indentWithTabs: true,
      }
    });
    var simplemde = new SimpleMDE({
      element: document.getElementById("preview"),
      renderingConfig: {
        singleLineBreaks: false,
        codeSyntaxHighlighting: true,
      }
    });
    },500)
  },
  handleSubmit: function handleSubmit(e){
    e.preventDefault();
    var user_id = this.state.user.id;
    var post_id = this.state.post.id;
    var content = this.state.editorValue;
  },
  render: function(){
    var body = this.state.post.body;
    function createMarkup() { return {__html: body}; };
    var listComments = this.state.comments.map(function (v, i) {
       return (
          <div className="commentDiv" key={i}>
             <img className="icon" src={v.photo}/>
             <Comment
                alias={v.alias}
                commentContent={v.content}
                current_user={this.state.user.id}
                user_id={v.user_id}
                post_id={v.post_id}
                comment_id={v.id}
             />
          </div>
        )
    }.bind(this));
if(this.state.user.id === this.state.post_author.id){
    return (
      <div className="container">
        <h2 className="lead"> Title: {this.state.post.title}</h2>
        <div className="bodyDiv">

        <div className="ReactButton">
        <form class="deleteBtn" action={"/users/" + this.state.user.id + "/posts/" + this.state.post.id + "?_method=DELETE"} method="POST">
          <button className="btn btn-danger btn-sm"> <span className="glyphicon glyphicon-trash deleteBtn"></span> </button>
        </form>
        </div>

          <div className="ReactButton">
          <a href={"/users/" + this.state.user.id + "/posts/" + this.state.post.id + "/edit"}>
            <button className="btn btn-primary btn-sm"> <span className="glyphicon glyphicon-pencil editBtn"></span> </button>
          </a>
          </div>

          <h4 className="lead"> Body:</h4>
          <div className="bodyBody">
            <img className="icon" src={this.state.post_author.photo}/>
            <div className="commentBody">
              <div
                dangerouslySetInnerHTML={createMarkup()}
              >
              </div>
              <p className="postAuthor">Posted By {this.state.post_author.alias}</p>
            </div>

          </div>
          <h4 className="lead">Comments: {this.state.comments.length}</h4>
          <CommentInput
            post={this.state.post}
            commentValue={this.commentValue}
            value={this.state.text}
          />
          {listComments}
        </div>
      </div>
    )}
    else {
      return (
        <div className="container">
          <h2 className="lead"> Title: {this.state.post.title}</h2>
          <div className="bodyDiv">
            <h4 className="lead"> Body:</h4>
            <div className="bodyBody">
              <img className="icon" src={this.state.post_author.photo}/>
              <div className="commentBody">
                <div
                  dangerouslySetInnerHTML={createMarkup()}
                >
                </div>
                <p className="postAuthor">Posted By {this.state.post_author.alias}</p>
              </div>

            </div>
            <h4 className="lead">Comments: {this.state.comments.length}</h4>
            <CommentInput
              post={this.state.post}
              commentValue={this.commentValue}
              value={this.state.text}
            />
            {listComments}
          </div>
        </div>
      )
    }
  }
});



var Comment = React.createClass({
  render: function(){
    var content = this.props.commentContent;
    function createMarkup() { return {__html: content}; };
    if(this.props.user_id === this.props.current_user){
      return (

          <div
            className="commentBody"
          >
        <div className="ReactButton">
        <form id="deleteBtn" action={'/posts/' + this.props.post_id +'/comments/' + this.props.comment_id + "?_method=DELETE"} method="POST">
          <button className="btn btn-danger btn-sm"> <span className="glyphicon glyphicon-trash"></span> </button>
        </form>
        </div>

        <div className="ReactButton">
        <a href={'/posts/' + this.props.post_id +'/comments/' + this.props.comment_id +'/edit'}>
            <button className="btn btn-primary btn-sm"> <span className="glyphicon glyphicon-pencil"></span> </button>
        </a>
        </div>



          <div
            dangerouslySetInnerHTML={createMarkup()}
          >

          </div>
            <a href={"/users/" + this.props.user_id + "/posts"}>
              <p className='commentAuthor'>Commented by: {this.props.alias} </p>
            </a>
          </div>
      )
    }
    else{
      return (
          <div
            className="commentBody"
          >
          <div
            dangerouslySetInnerHTML={createMarkup()}
          >

          </div>
            <a href={"/users/" + this.props.user_id + "/posts"}>
              <p className='commentAuthor'>Commented by: {this.props.alias} </p>
            </a>
          </div>
        )
    }
  }
});


var CommentInput = React.createClass({
  displayName: "Comment Dialog",
  render: function(){
    return (
      <div id='commentEdit'>
      <form id="form" action={"/posts/" + this.props.post.id + "/comments"} method="POST">
        <textarea
          id="body"
          rows="8"
          cols="20"
          name="comment[content]"
          onChange={this.props.handleTextChange}
          value={this.props.value}
          placeholder="Write a comment here!"
        />
        <input className="btn btn-primary" type="submit" value="Add this comment"/>
      </form>
      </div>
    )
  }
})

ReactDOM.render(<Page />, document.getElementById('container'));
