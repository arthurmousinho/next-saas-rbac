import { getCurrentOrgSlug } from "@/auth/auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getBilling } from "@/http/billing/get-billing";

function formatPrice(price: number) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }).format(price);
}


export default async function Billing() {

    const currentOrgSlug = await getCurrentOrgSlug();

    const { billing } = await getBilling({ slug: currentOrgSlug! });

    return (
        <>
            <Separator />

            <Card>
                <CardHeader>
                    <CardTitle>
                        Billing
                    </CardTitle>
                    <CardDescription>
                        Informations about your organization costs
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>
                                    Cost Type
                                </TableHead>
                                <TableHead className="text-right" style={{ width: 120 }}>
                                    Quantity
                                </TableHead>
                                <TableHead className="text-right" style={{ width: 220 }}>
                                    Subtotal
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow>
                                <TableCell>Amount of projects</TableCell>
                                <TableCell className="text-right">
                                    {billing.projects.amount}
                                </TableCell>
                                <TableCell className="text-right">
                                    {formatPrice(billing.projects.price)} ({formatPrice(billing.projects.unit)} each)</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Amount of seats</TableCell>
                                <TableCell className="text-right">
                                    {billing.seats.amount}
                                </TableCell>
                                <TableCell className="text-right">
                                    {formatPrice(billing.seats.price)} ({formatPrice(billing.seats.unit)} each)
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell></TableCell>
                                <TableCell className="text-right">
                                    Total
                                </TableCell>
                                <TableCell className="text-right">
                                    {formatPrice(billing.total)}
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

        </>
    )
}