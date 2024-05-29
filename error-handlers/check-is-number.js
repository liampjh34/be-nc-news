exports.checkIsNumber = async (passedValue) => {
    const parsedValue = parseInt(passedValue)

    if (!(typeof parsedValue === 'number')) {
        return Promise.reject({
            status: 400,
            msg: 'Wrong data type'
        })
    } else {
        if (isNaN(parsedValue)) {
            return Promise.reject({
                status: 400,
                msg: 'Wrong data type'
            })
        }
    }

    return Promise.resolve(true)
}