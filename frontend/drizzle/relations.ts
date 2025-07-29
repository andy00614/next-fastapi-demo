import { relations } from "drizzle-orm/relations";
import { user, file, payment, paymentEvent, session, account } from "./schema";

export const fileRelations = relations(file, ({one}) => ({
	user: one(user, {
		fields: [file.uploadUserId],
		references: [user.id]
	}),
}));

export const userRelations = relations(user, ({many}) => ({
	files: many(file),
	payments: many(payment),
	sessions: many(session),
	accounts: many(account),
}));

export const paymentRelations = relations(payment, ({one, many}) => ({
	user: one(user, {
		fields: [payment.userId],
		references: [user.id]
	}),
	paymentEvents: many(paymentEvent),
}));

export const paymentEventRelations = relations(paymentEvent, ({one}) => ({
	payment: one(payment, {
		fields: [paymentEvent.paymentId],
		references: [payment.id]
	}),
}));

export const sessionRelations = relations(session, ({one}) => ({
	user: one(user, {
		fields: [session.userId],
		references: [user.id]
	}),
}));

export const accountRelations = relations(account, ({one}) => ({
	user: one(user, {
		fields: [account.userId],
		references: [user.id]
	}),
}));