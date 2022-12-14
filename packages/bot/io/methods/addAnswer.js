const { generateRef } = require('../../utils/hash')
const { toJson } = require('./toJson')
/**
 *
 * @param answer string
 * @param options {media:string, buttons:[{"body":"😎 Cursos"}], delay:ms, capture:true default false}
 * @returns
 */
const addAnswer =
    (inCtx) =>
    (answer, options, cb = null, nested = []) => {
        answer = Array.isArray(answer) ? answer.join('\n') : answer
        /**
         * Todas las opciones referentes a el mensaje en concreto options:{}
         * @returns
         */
        const getAnswerOptions = () => ({
            media:
                typeof options?.media === 'string' ? `${options?.media}` : null,
            buttons: Array.isArray(options?.buttons) ? options.buttons : [],
            capture:
                typeof options?.capture === 'boolean'
                    ? options?.capture
                    : false,
            child:
                typeof options?.child === 'string' ? `${options?.child}` : null,
            delay: typeof options?.delay === 'number' ? options?.delay : 0,
        })

        const getNested = () => ({
            nested: Array.isArray(nested) ? nested : [],
        })

        const callback =
            typeof cb === 'function'
                ? cb
                : () => console.log('Callback no definida')

        const lastCtx = inCtx.hasOwnProperty('ctx') ? inCtx.ctx : inCtx

        /**
         * Esta funcion se encarga de mapear y transformar todo antes
         * de retornar
         * @returns
         */
        const ctxAnswer = () => {
            const ref = `ans_${generateRef()}`

            const options = {
                ...getAnswerOptions(),
                ...getNested(),
                keyword: {},
                callback: !!cb,
            }

            const json = [].concat(inCtx.json).concat([
                {
                    ref,
                    keyword: lastCtx.ref,
                    answer,
                    options,
                },
            ])

            const callbacks = [].concat(inCtx.callbacks).concat([
                {
                    ref: lastCtx.ref,
                    callback,
                },
            ])

            return {
                ...lastCtx,
                ref,
                answer,
                json,
                options,
                callbacks,
            }
        }

        /// Retornar contexto no colocar nada más abajo de esto
        const ctx = ctxAnswer()

        return {
            ctx,
            ref: ctx.ref,
            addAnswer: addAnswer(ctx),
            toJson: toJson(ctx),
        }
    }

module.exports = { addAnswer }