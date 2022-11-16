TRUNCATE public."User", public."Space", public."Event";
ALTER SEQUENCE "Event_id_seq" RESTART WITH 1;
ALTER SEQUENCE "Space_id_seq" RESTART WITH 1;
ALTER SEQUENCE "User_id_seq" RESTART WITH 1;

INSERT INTO public."User" ("name",address) VALUES
	 ('User1','0xgTUNvOmRdTe8ygguljGokkx85S5rnsnz0ZE1kUEk'),
	 ('User2','0xhr4afgrxTNpfyhXBKUWVws7nyDqld310tVZH9nm0'),
	 ('User3','0xWcv0ziOY71THqvyqWCyufFdBWlGx01KWs1wSu90a'),
	 ('User4','0xyPmfojDANnF7cUIetkil3IHw1OE3gHELvN3kB9K1'),
	 ('User5','0xYRR0nWUIv7H61xg3pRD2lb191TTWSJ9kg1a4VRuO');

INSERT INTO public."Space" ("userId","location","name") VALUES
	 (1,'Rua Martires da Liberdade 25 Porto','Martyr'),
	 (2,'Rua do Sol 110 Porto','SunO Hum'),
	 (3,'Rua Fernandes de Freitas 521 Porto','Fried Eggs'),
	 (4,'Avenida dos Aliados 67 Porto','The Locust'),
	 (5,'Avenida dos Combatentes 100 Porto','The House');


INSERT INTO public."Event" ("name",description,"date", "location","spaceId") VALUES
	 ('It comes!','Another fine edition of "It Comes!". Spooky drinks and the skeleton inside everyone hittin'' bones on the dance floor on the best non-Halloween creepy party of all.',localtimestamp::date + interval '21h' ,NULL,1),
	 ('Cook With Us','Come learn some healthy breakfast recipes with us on a vegan inclusive cooking workshop.', localtimestamp::date + interval '11h',NULL,3),
	 ('Stone Gate','Stoner Rock mini-festival, bring friends and prepare your necks.', localtimestamp::date + interval '5' day + interval '22h','Praça dos Loios Porto',2),
	 ('Drop Dead','Punk Night!! ', localtimestamp::date + interval '1' day + interval '23h',NULL,2),
	 ('Jazz Sessions 5','Grab a Drink. Molano Trio, Justin Joler and The Konkers', localtimestamp::date + interval '22h',NULL,4),
	 ('Jazz Sessions 4','Free Jam night with the Locust Band', localtimestamp::date - interval '5' day + interval '22h',NULL,4),
	 ('Movie Night','Showing "The Fall" on open air cinema', localtimestamp::date + interval '6' day + interval '21h','Serra do Pilar Gaia',5),
	 ('Movie Night','Showing "Goodfellas"', localtimestamp::date + interval '21h',NULL,5),
	 ('Movie Night','Showing "Primer"', localtimestamp::date - interval '4' + interval '21h',NULL,5),
	 ('Movie Night','Showing "Hana Bi"', localtimestamp::date - interval '15' + interval '21h',NULL,5);

-- localtimestamp::date + interval '21h';
-- localtimestamp::date + interval '11h';
-- localtimestamp::date + '5' day + interval '22h';
-- localtimestamp::date + '1' day + interval '23h';
-- localtimestamp::date + interval '22h';
-- localtimestamp::date - '5' day + interval '22h';
-- localtimestamp::date + '6' day + interval '21h';
-- localtimestamp::date + interval '21h';
-- localtimestamp::date - '4' + interval '21h';
-- localtimestamp::date - '15' + interval '21h';