const fetchData = async (endpoint) => {
    try {
        const data = await fetch(`https://jsonplaceholder.typicode.com/${endpoint}`);
        return data.json();
    } catch (error) {
        next(error);
    }
}

(async () => {
    try {
        //2. get 10 users
        const getUser = await fetchData('users');
        console.log(getUser)

        //3. Post and Cmt User map
        const [getPost, getComment] = await Promise.all([
            fetchData('posts'),
            fetchData('comments')
        ])
        const PostCommentUserMap = getUser.map((user) => {
            return {
                id: user.id,
                name: user.name,
                username: user.username,
                email: user.email,
                comments: getComment.filter((comment) => comment.email === user.email),
                posts: getPost.filter((post) => post.userId === user.id)
            }
        });
        console.log("Post comment User map: ", PostCommentUserMap);

        //4. filter user comment lenth > 3
        const UserCommentLengthMore3 = JSON.parse(JSON.stringify(PostCommentUserMap));
        // const UserCommentLengthMore3 = [...PostCommentUserMap]
        console.log("User comment lenth > 3: ", UserCommentLengthMore3.filter(
            user => user.comments.length > 3
        ));

        //5. Reformat the data count post comment
        const reformatUser = UserCommentLengthMore3.map(user => {
            return {
                id: user.id,
                name: user.name,
                username: user.username,
                email: user.email,
                comments: user.comments.length,
                posts: user.posts.length,
            }
        });
        console.log("Reformat: ", reformatUser);

        //6. Who is the user with the most comments/posts?
        // reformatUser.slice() //copy
        const userSortByPost = reformatUser.slice().sort((userA, userB) => {
            userB.comments - userA.comments
        })
        console.log('userSortByPost: ', userSortByPost[0]);

        const userSortByCom = reformatUser.slice().sort((userA, userB) => {
            userB.comments - userA.comments
        })
        console.log('userSortByCom: ', userSortByCom[0]);

        //7. Sort the list of users by the postsCount value descending?
        console.log('userSortByPost: ', userSortByPost);

        //8. Merge post comment
        const getPostById1 = getPost.filter(post => post.id === 1);
        const getCommentByPostId1 = getComment.filter(cmt => cmt.postId === 1)
        const mergedPostComment = {
            ...getPostById1,
            comments: getCommentByPostId1
        };
        console.log('Merge: ', mergedPostComment);
    } catch (error) {
        console.log(error);
    }
})();

