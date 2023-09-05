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
        const commentOfPost = comment.filter(comment => comment.postId === id)
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
        const users = await fetchData('users');
        console.log('2. all user:', users)

        //3. Post and Cmt User map
        const [posts, comments] = await Promise.all([
            fetchData('posts'),
            fetchData('comments')
        ])
        //  pascal case => camelcase
        const postsAndCommentsWithUsers = users.map((user) => {
            const { ...another } = user;
            return {
                ...another,
                comments: (comments.filter((comment) => comment.email === user.email)),
                posts: (posts.filter((post) => post.userId === user.id))
            }
        });
        console.log("3. posts And Comment With Users: ", postsAndCommentsWithUsers);

        //4. filter user comment lenth > 3
        const usersWithMoreThan3Comments = JSON.parse(JSON.stringify(postsAndCommentsWithUsers));
        console.log("4. User comment lenth > 3: ", usersWithMoreThan3Comments.filter(
            user => user.comments.length > 3
        ));

        //5. Reformat the data count post comment
        const reformatData = usersWithMoreThan3Comments.map(user => {
            const { comments, posts, ...another } = user;
            return {
                ...another,
                commentsCount: user.comments.length,
                postsCount: user.posts.length
            }
        });
        console.log("5. Reformat: ", reformatData);

        //6. Who is the user with the most comments/posts?
        const userWithMostPosts = reformatData.reduce((userA, userB) => {
            if (userB.postsCount > userA.postsCount) {
                return userB;
            } else {
                return userA;
            }
        })
        console.log('6. userWithMostPosts: ', userWithMostPosts);

        const userWithMostComments = reformatData.reduce((userA, userB) => {
            if (userB.commentsCount > userA.commentsCount) {
                return userB;
            } else {
                return userA;
            }
        })
        console.log('6. userWithMostComments: ', userWithMostComments);

        //7. Sort the list of users by the postsCount value descending?
        const userSortedByPostCount = reformatData.sort((userA, userB) => {
            return userB.postsCount - userA.postsCount;
        });
        console.log('7. userSortedByPostCount: ', userSortedByPostCount);

        //8. Merge post comment
        const data = await getPostAndCommentById(1);
        const postWithComments = {
            ...data.post,
            comments: [data.commentOfPost]
        };
        console.log('8. Merger: ', postWithComments)

    } catch (error) {
        console.log(error);
    }
})();

