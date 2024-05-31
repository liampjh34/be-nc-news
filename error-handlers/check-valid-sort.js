exports.isValidSort = async (desiredSort) => {
    const validSorts = [
        'author',
        'title',
        'topic',
        'votes',
        'comments',
        undefined
    ]

    if (validSorts.includes(desiredSort)) {
        return Promise.resolve(true)
    } 

    return Promise.reject({
        status: 400,
        msg: 'Incorrect sort value'
    })

}