const fetchData = async (endpoint) => {
    try {
        const data = await fetch(`https://jsonplaceholder.typicode.com/${endpoint}`);
        return data.json();
    } catch (error) {
        console.log(error);
    }
}
const getPostAndCommentById = async (id) => {
    try {
        const post = await fetchData(`posts/${id}`);
        const comment = await fetchData(`comments`);
        const commentOfPost = comment.filter(c => c.postId === id)
        return {
            post,
            commentOfPost
        }
    } catch (error) {
        next(error);
    }
}
(async () => {
    try {
        //2. get 10 users
        const getUser = await fetchData('users');
        console.log('all user:', getUser)

        //3. Post and Cmt User map
        const [getPost, getComment] = await Promise.all([
            fetchData('posts'),
            fetchData('comments')
        ])
        const PostCommentUserMap = getUser.map((user) => {
            const { comments, posts, ...another } = user;
            return {
                ...another,
                comments: (getComment.filter((comment) => comment.email === user.email)),
                posts: (getPost.filter((post) => post.userId === user.id))
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
            const { commentsCount, postsCount, ...another } = user;
            return {
                ...another,
                commentsCount: user.comments.length,
                postsCount: user.posts.length
            }
        });
        console.log("Reformat: ", reformatUser);

        //6. Who is the user with the most comments/posts?
        // reformatUser.slice() //copy
        const userMostPost = reformatUser.reduce((userA, userB) => {
            if (userB.postsCount > userA.postsCount) {
                return userB;
            } else {
                return userA;
            }
        })
        console.log('userMostPost: ', userMostPost);

        const userMostCom = reformatUser.reduce((userA, userB) => {
            if (userB.commentsCount > userA.commentsCount) {
                return userB;
            } else {
                return userA;
            }
        })
        console.log('userMostCom: ', userMostCom);

        //7. Sort the list of users by the postsCount value descending?
        const userSortByPost = reformatUser.slice().sort((userA, userB) => {
            return userB.postsCount - userA.postsCount;
        });
        console.log('userSortByPost: ', userSortByPost);

        //8. Merge post comment

        const data = await getPostAndCommentById(1);
        const mergedPostComment = {
            ...data.post,
            comment: [data.commentOfPost]
        };
        console.log('Merger: ', mergedPostComment)

    } catch (error) {
        console.log(error);
    }
})();

