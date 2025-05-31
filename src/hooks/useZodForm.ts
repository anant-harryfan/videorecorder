import { UseMutateFunction } from "@tanstack/react-query";
import { DefaultValues, useForm } from "react-hook-form";
import z, { ZodSchema } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const useZodForm = <T extends z.ZodType<any>>(
    // schema: ZodSchema,
    schema: T,
    // mutation: UseMutateFunction,
    defaultValues?: DefaultValues<z.TypeOf<T>>|undefined
) => {
    const {
        register,
        formState: {errors},
        handleSubmit,
        watch,
        reset
    } = useForm<z.infer<T>>({
        resolver: zodResolver(schema),
        defaultValues   ,
    });

    return {
        register,
        watch,
        reset,
        handleSubmit    ,
        errors
    }
};
export default useZodForm