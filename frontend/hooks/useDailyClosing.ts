import { useCreateDailyClosingMutation, useIsSalesConfirmedQuery } from "@/lib/graphql/graphql";
import { ApolloError } from "@apollo/client";

export const useDailyClosing = () => {
    const [createDailyClosing] = useCreateDailyClosingMutation();

    const createData = async (date: string, totalSales: number, totalOrders: number) => {
        try {
            const result = await createDailyClosing({ 
                variables: { 
                    input: {
                        closingDate: date, 
                        totalSales: totalSales, 
                        totalOrders: totalOrders
                    } 
                } 
            });
            
            if (result.errors) {
                throw new Error(result.errors[0].message);
            }
            
            return result.data;
        } catch (error) {
            if (error instanceof ApolloError) {
                throw new Error(error.graphQLErrors[0]?.message || "売上の確定に失敗しました。");
            }
            throw error;
        }
    }
    
    const useIsSalesConfirmed = (today: string) => {
        return useIsSalesConfirmedQuery({
            variables: { date: today },
        });
    }
    return {createData, useIsSalesConfirmed}
}